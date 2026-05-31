export default function ProfilePage() {
  return (
    <>
      <section className="mb-16">
        <h2 className="font-headline-md text-headline-md text-primary mb-8 border-b border-surface-container pb-4">
          Personal Information
        </h2>
        <form className="space-y-8 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <input
                className="w-full border-0 border-b border-surface-container-high bg-transparent py-2 px-0 text-primary placeholder-transparent focus:border-primary focus:ring-0 peer"
                id="fname"
                placeholder="First Name"
                type="text"
                defaultValue="Sterling"
              />
              <label
                className="absolute left-0 -top-3.5 text-secondary font-label-caps text-label-caps transition-all peer-placeholder-shown:text-body-md peer-placeholder-shown:font-body-md peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-label-caps peer-focus:font-label-caps peer-focus:text-primary"
                htmlFor="fname"
              >
                First Name
              </label>
            </div>
            <div className="relative">
              <input
                className="w-full border-0 border-b border-surface-container-high bg-transparent py-2 px-0 text-primary placeholder-transparent focus:border-primary focus:ring-0 peer"
                id="lname"
                placeholder="Last Name"
                type="text"
                defaultValue="Archer"
              />
              <label
                className="absolute left-0 -top-3.5 text-secondary font-label-caps text-label-caps transition-all peer-placeholder-shown:text-body-md peer-placeholder-shown:font-body-md peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-label-caps peer-focus:font-label-caps peer-focus:text-primary"
                htmlFor="lname"
              >
                Last Name
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <input
                className="w-full border-0 border-b border-surface-container-high bg-transparent py-2 px-0 text-primary placeholder-transparent focus:border-primary focus:ring-0 peer"
                id="email"
                placeholder="Email Address"
                type="email"
                defaultValue="sterling@example.com"
              />
              <label
                className="absolute left-0 -top-3.5 text-secondary font-label-caps text-label-caps transition-all peer-placeholder-shown:text-body-md peer-placeholder-shown:font-body-md peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-label-caps peer-focus:font-label-caps peer-focus:text-primary"
                htmlFor="email"
              >
                Email Address
              </label>
            </div>
            <div className="relative">
              <input
                className="w-full border-0 border-b border-surface-container-high bg-transparent py-2 px-0 text-primary placeholder-transparent focus:border-primary focus:ring-0 peer"
                id="phone"
                placeholder="Phone Number"
                type="tel"
                defaultValue="+1 (555) 123-4567"
              />
              <label
                className="absolute left-0 -top-3.5 text-secondary font-label-caps text-label-caps transition-all peer-placeholder-shown:text-body-md peer-placeholder-shown:font-body-md peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-label-caps peer-focus:font-label-caps peer-focus:text-primary"
                htmlFor="phone"
              >
                Phone Number
              </label>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              className="bg-primary text-on-primary px-8 py-3 font-label-caps text-label-caps uppercase tracking-widest hover:bg-tertiary-fixed-dim hover:text-primary transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              className="border border-primary text-primary px-8 py-3 font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors"
            >
              Change Password
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-headline-md text-headline-md text-primary mb-8 border-b border-surface-container pb-4">
          Address Book
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Default Shipping */}
          <div className="border border-surface-container p-6 relative">
            <span className="absolute top-0 right-0 bg-surface-container-high text-primary px-3 py-1 font-label-caps text-[10px] tracking-widest uppercase">
              Default Shipping
            </span>
            <h3 className="font-headline-md text-[18px] text-primary mb-4 mt-2">Sterling Archer</h3>
            <p className="font-body-md text-secondary space-y-1">
              <span className="block">123 Secret Agent Lane</span>
              <span className="block">Suite 404</span>
              <span className="block">New York, NY 10001</span>
              <span className="block">United States</span>
            </p>
            <div className="mt-6 flex gap-4">
              <button className="font-label-caps text-label-caps text-secondary hover:text-primary underline underline-offset-4 transition-colors uppercase tracking-widest">
                Edit
              </button>
              <button className="font-label-caps text-label-caps text-secondary hover:text-error underline underline-offset-4 transition-colors uppercase tracking-widest">
                Delete
              </button>
            </div>
          </div>

          {/* Add New Address */}
          <div className="border border-dashed border-surface-container-high p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary hover:bg-surface-container-low transition-all min-h-[250px]">
            <span className="material-symbols-outlined text-[32px] text-secondary group-hover:text-primary mb-4 transition-colors">
              add_location
            </span>
            <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-widest group-hover:text-primary transition-colors">
              Add New Address
            </h3>
          </div>
        </div>
      </section>
    </>
  );
}
