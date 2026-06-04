import nodemailer from "nodemailer";

const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

const getBaseHtml = (title: string, customerName: string, content: string) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lumiere-ecommerce-mocha.vercel.app';
  
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border: 1px solid #eeeeee;">
      <div style="text-align: center; padding-bottom: 30px; border-bottom: 1px solid #eeeeee;">
        <img src="${siteUrl}/assets/images/logo.png" alt="LUMIERE" style="height: 35px; width: auto; object-fit: contain;" />
      </div>
      <div style="padding: 30px 0; color: #333333; line-height: 1.6; font-size: 14px;">
        <h1 style="font-size: 18px; font-weight: 300; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; color: #111111; text-align: center;">
          ${title}
        </h1>
        <p>Dear ${customerName},</p>
        ${content}
      </div>
      <div style="text-align: center; padding-top: 30px; border-top: 1px solid #eeeeee; font-size: 12px; color: #999999;">
        <p>&copy; ${new Date().getFullYear()} Lumiere. All rights reserved.</p>
      </div>
    </div>
  `;
};

export async function sendOrderConfirmationEmail(
  userEmail: string,
  orderId: string,
  cartItems: any[],
  contactInfo: any,
  shippingAddress: any,
  totals: any
) {
  try {
    const transporter = getTransporter();
    
    const itemsHtml = cartItems.map((item) => {
      const productData = Array.isArray(item.product) ? item.product[0] : item.product;
      const price = productData.price * item.quantity;
      return `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">${productData.name} <span style="color:#999; font-size: 12px; margin-left: 5px;">x${item.quantity}</span></td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; text-align: right;">$${price.toLocaleString()}</td>
        </tr>
      `;
    }).join("");

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lumiere-ecommerce-mocha.vercel.app';
    const orderIdShort = orderId.split('-')[0].toUpperCase();

    const content = `
      <p>Thank you for choosing Lumiere. Your order has been successfully placed and is now being meticulously prepared for shipment.</p>
      
      <div style="margin-top: 30px; margin-bottom: 30px;">
        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #111; padding-bottom: 5px; margin-bottom: 10px;">Order Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
        </table>
      </div>

      <div style="background-color: #fcfcfc; padding: 20px; border: 1px solid #f0f0f0; margin-bottom: 30px;">
        <p style="margin: 0 0 10px 0;"><strong>Order Reference:</strong> #${orderIdShort}</p>
        <p style="margin: 0 0 10px 0;"><strong>Shipping Address:</strong> ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}</p>
        <p style="margin: 0 0 10px 0;"><strong>Total Amount:</strong> $${totals.total.toLocaleString()}</p>
        <p style="margin: 0;"><strong>Status:</strong> Processing</p>
      </div>
      
      <div style="text-align: center; margin-top: 40px;">
        <a href="${siteUrl}/my-account/orders/${orderId}" style="display: inline-block; background-color: #111111; color: #ffffff; text-decoration: none; padding: 14px 28px; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">
          View Order Status
        </a>
      </div>
    `;

    await transporter.sendMail({
      from: `"Lumiere" <${process.env.SMTP_EMAIL}>`,
      to: userEmail,
      subject: `Lumiere - Order Confirmed #${orderIdShort}`,
      html: getBaseHtml("Order Confirmed", contactInfo.firstName || 'Customer', content),
    });
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
  }
}

export async function sendOrderStatusUpdateEmail(
  userEmail: string,
  orderId: string,
  status: string,
  customerName: string
) {
  try {
    const transporter = getTransporter();
    const orderIdShort = orderId.split('-')[0].toUpperCase();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lumiere-ecommerce-mocha.vercel.app';
    
    let statusSubject = "";
    let statusMessage = "";
    
    if (status === 'shipped') {
      statusSubject = `Your Lumiere Order #${orderIdShort} has Shipped`;
      statusMessage = `Great news! Your order has been updated to SHIPPED. It has been carefully packaged and handed over to our shipping partner.`;
    } else if (status === 'delivered') {
      statusSubject = `Your Lumiere Order #${orderIdShort} has been Delivered`;
      statusMessage = `Your order status is now DELIVERED. We hope you enjoy your new piece. Thank you for choosing Lumiere.`;
    } else if (status === 'cancelled') {
      statusSubject = `Your Lumiere Order #${orderIdShort} has been Cancelled`;
      statusMessage = `We are sorry to inform you that your order has been CANCELLED. If you have any questions, please contact our support.`;
    } else if (status === 'processing') {
      statusSubject = `Your Lumiere Order #${orderIdShort} is Processing`;
      statusMessage = `Your order status has been updated to PROCESSING. We will notify you once it ships.`;
    } else if (status === 'pending') {
      statusSubject = `Your Lumiere Order #${orderIdShort} is Pending`;
      statusMessage = `Your order status has changed to PENDING. We will process it shortly.`;
    } else {
      statusSubject = `Your Lumiere Order #${orderIdShort} Status Updated`;
      statusMessage = `The status of your order has been updated to ${status.toUpperCase()}.`;
    }

    const content = `
      <p>${statusMessage}</p>
      
      <div style="text-align: center; margin-top: 40px;">
        <a href="${siteUrl}/my-account/orders/${orderId}" style="display: inline-block; background-color: #111111; color: #ffffff; text-decoration: none; padding: 14px 28px; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">
          View Order Status
        </a>
      </div>
    `;

    await transporter.sendMail({
      from: `"Lumiere" <${process.env.SMTP_EMAIL}>`,
      to: userEmail,
      subject: statusSubject,
      html: getBaseHtml("Order Update", customerName, content),
    });
  } catch (error) {
    console.error("Failed to send order status email:", error);
  }
}
