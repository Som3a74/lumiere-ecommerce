import { NextResponse } from "next/server";
import { Client, handle_file } from "@gradio/client";
import sharp from "sharp";

export const maxDuration = 300; // Allow up to 300 seconds (5 minutes) for execution

export async function POST(req: Request) {
  try {
    const { userImageBase64, productImageUrl } = await req.json();

    if (!userImageBase64 || !productImageUrl) {
      return NextResponse.json({ success: false, error: "Missing images" }, { status: 400 });
    }

    if (!process.env.HF_TOKEN) {
      return NextResponse.json({ success: false, error: "Missing Hugging Face Token" }, { status: 500 });
    }

    // Convert Base64 to Blob
    const userImageBlob = await fetch(userImageBase64).then((r) => r.blob());

    // Fetch product image and convert to JPEG using Sharp to avoid format issues (e.g. AVIF) in Gradio
    const productResponse = await fetch(productImageUrl);
    if (!productResponse.ok) {
      throw new Error(`Failed to fetch product image: ${productResponse.statusText}`);
    }
    const productArrayBuffer = await productResponse.arrayBuffer();
    const productBuffer = Buffer.from(productArrayBuffer);
    const jpegBuffer = await sharp(productBuffer).jpeg().toBuffer();
    const productBlob = new Blob([new Uint8Array(jpegBuffer)], { type: 'image/jpeg' });

    // Connect to Hugging Face with the token using OOTDiffusion space
    const app = await Client.connect("eduardo4547/OOTDiffusion", { token: process.env.HF_TOKEN as any });

    const result = await app.predict("/process_hd", {
      vton_img: handle_file(userImageBlob),
      garm_img: handle_file(productBlob),
      n_samples: 1,
      n_steps: 20,
      image_scale: 2,
      seed: -1,
    });

    // The result is returned as an array with the URL object
    if (result && result.data) {
      const dataArray = result.data as any[];
      if (dataArray.length > 0) {
        // Output might be a string or an object with a url property
        const out = dataArray[0];
        if (out && typeof out === 'object' && out.url) {
          return NextResponse.json({ success: true, imageUrl: out.url });
        } else if (typeof out === 'string') {
          return NextResponse.json({ success: true, imageUrl: out });
        }
      }
    }

    throw new Error("No valid data returned from the model");
  } catch (error: any) {
    console.error("Virtual Try-On API Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to generate image" }, { status: 500 });
  }
}
