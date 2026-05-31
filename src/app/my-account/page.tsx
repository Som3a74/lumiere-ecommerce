import Link from "next/link";

export default function MyAccountPage() {
  return (
    <>
      {/* Order History Table */}
      <section>
        <h2 className="font-headline-md text-headline-md text-primary mb-8 border-b border-surface-container pb-4">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-primary font-label-caps text-label-caps text-secondary uppercase tracking-widest">
                <th className="py-4 px-2 font-normal">Order ID</th>
                <th className="py-4 px-2 font-normal">Date</th>
                <th className="py-4 px-2 font-normal">Status</th>
                <th className="py-4 px-2 font-normal text-right">Total</th>
                <th className="py-4 px-2 font-normal text-right"></th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md divide-y divide-surface-container">
              <tr className="group hover:bg-surface-container-low transition-colors">
                <td className="py-6 px-2 font-headline-md text-[16px] text-primary">#LUM-8492</td>
                <td className="py-6 px-2 text-secondary">Oct 12, 2024</td>
                <td className="py-6 px-2">
                  <span className="inline-flex items-center px-3 py-1 bg-surface-container border border-outline-variant text-[12px] tracking-widest uppercase">
                    Processing
                  </span>
                </td>
                <td className="py-6 px-2 text-right text-primary">$4,250.00</td>
                <td className="py-6 px-2 text-right">
                  <button className="font-label-caps text-label-caps text-secondary hover:text-primary underline underline-offset-4 transition-colors">
                    View Details
                  </button>
                </td>
              </tr>
              <tr className="group hover:bg-surface-container-low transition-colors">
                <td className="py-6 px-2 font-headline-md text-[16px] text-primary">#LUM-7104</td>
                <td className="py-6 px-2 text-secondary">Sep 04, 2024</td>
                <td className="py-6 px-2">
                  <span className="inline-flex items-center px-3 py-1 bg-primary text-on-primary text-[12px] tracking-widest uppercase">
                    Delivered
                  </span>
                </td>
                <td className="py-6 px-2 text-right text-primary">$12,800.00</td>
                <td className="py-6 px-2 text-right">
                  <button className="font-label-caps text-label-caps text-secondary hover:text-primary underline underline-offset-4 transition-colors">
                    View Details
                  </button>
                </td>
              </tr>
              <tr className="group hover:bg-surface-container-low transition-colors">
                <td className="py-6 px-2 font-headline-md text-[16px] text-primary">#LUM-6522</td>
                <td className="py-6 px-2 text-secondary">Jul 18, 2024</td>
                <td className="py-6 px-2">
                  <span className="inline-flex items-center px-3 py-1 bg-primary text-on-primary text-[12px] tracking-widest uppercase">
                    Delivered
                  </span>
                </td>
                <td className="py-6 px-2 text-right text-primary">$890.00</td>
                <td className="py-6 px-2 text-right">
                  <button className="font-label-caps text-label-caps text-secondary hover:text-primary underline underline-offset-4 transition-colors">
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Wishlist Preview */}
      <section>
        <div className="flex justify-between items-end border-b border-surface-container pb-4 mb-8">
          <h2 className="font-headline-md text-headline-md text-primary">Curated Wishlist</h2>
          <Link
            href="/my-account/wishlist"
            className="font-label-caps text-label-caps text-secondary hover:text-primary transition-colors tracking-widest uppercase flex items-center space-x-1 group"
          >
            <span>View All</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Wishlist Item 1 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[3/4] bg-surface-container overflow-hidden mb-6">
              <Link href="/collections">
                <img
                  alt="The Chronomètre"
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcHzOmGSDd4PmuMHARUu47as7fEmuR57wsyuYFVi1tIgk0VY1nnY1yINcQZLwOzW6gODzW3ohwdq-DSSsT4W_M3BIiqu5mFcgSCw5pVyHVhOBiV7VCo29lS4Pjv2uZNM4LZjEHt7bqx7t0L7nSSSaCvnK8KdfSELpRGJWJ-495nktQwcEO76bzkFKxMsz_OnteP4wq7KcDYqtiFkswSeeAfxFkZi6PmEutBM7Y1D0R82-H5sMMgyEReImtP738lNcVRtLKdgSDbm20"
                />
              </Link>
              <button className="absolute top-4 right-4 text-primary bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
              </button>
            </div>
            <div className="text-center">
              <Link href="/collections">
                <h3 className="font-headline-md text-[20px] text-primary mb-2 hover:underline underline-offset-4">The Chronomètre</h3>
              </Link>
              <p className="font-body-md text-secondary">$12,800.00</p>
            </div>
          </div>

          {/* Wishlist Item 2 */}
          <div className="group cursor-pointer hidden sm:block">
            <div className="relative aspect-[3/4] bg-surface-container overflow-hidden mb-6">
              <Link href="/collections">
                <img
                  alt="Onyx Cabas"
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOSsL8MaPGDp_dXmPVLaLb-gNc92eZXo8OJgbG-xLcgeBCh_i84HFIZGAmSJAKcZ961N8xj6RZIee019rIPC03nAlAJQb55JrJOo2yz9kQ8hhiucRKlP7kF5bIxHd1dG6u0NDuyjle4TYubrDkgaUJ0rhBx7DwomltcnZjSToTenO-4kiXySSq1k8VcbCrVlPvLVK055VX4ESRbFSNoIrmX-kBSkkNyME9QNdAjU7xCAHt9Yix1YkVGRwU_eYkUqCJjIL6JpwFRFRk"
                />
              </Link>
              <button className="absolute top-4 right-4 text-primary bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
              </button>
            </div>
            <div className="text-center">
              <Link href="/collections">
                <h3 className="font-headline-md text-[20px] text-primary mb-2 hover:underline underline-offset-4">Onyx Cabas</h3>
              </Link>
              <p className="font-body-md text-secondary">$3,450.00</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
