import { Reveal } from "@/components/ui/reveal";
import Link from "next/link";

export function AboutAtelier() {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center bg-primary overflow-hidden">
      <div
        className="absolute inset-0 opacity-50 bg-fixed bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: "url('/assets/images/about/Mastery in Every Stitch.webp')" }}
        title="A dramatic close-up macro shot of fine leather stitching being performed on high-end leather goods."
      ></div>
      <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full grid grid-cols-1 md:grid-cols-2">
        <Reveal className="bg-primary/95 p-12 md:p-20 border border-gold-accent/30 backdrop-blur-md">
          <span className="font-label-caps text-label-caps text-gold-accent mb-6 block tracking-widest">L&apos;ATELIER DES RÊVES</span>
          <h2 className="font-headline-lg text-display-lg-mobile md:text-display-lg text-background mb-8 leading-tight">Mastery in Every Stitch</h2>
          <p className="text-surface-cream font-body-lg mb-12 leading-relaxed">Our leather goods are handcrafted from the finest tanneries in France and Italy, using traditional saddle-stitching techniques that ensure structural integrity for a lifetime.</p>
          <Link href="#" className="text-gold-accent font-label-caps text-label-caps border-b border-gold-accent pb-2 hover:text-background hover:border-background transition-colors tracking-widest">
            EXPLORE THE CRAFT
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
