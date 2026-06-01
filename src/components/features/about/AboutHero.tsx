import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

export function AboutHero() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0 bg-primary/30 z-10"></div>
      <Image
        src="/assets/images/home/hero-image.png"
        alt="A cinematic, low-key close-up of a master watchmaker's weathered hands delicately assembling the intricate movement of a luxury timepiece."
        fill
        sizes="100vw"
        className="object-cover scale-105"
        priority
      />
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-margin-mobile">
        <Reveal>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-6">
            The Art of Time.
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="font-headline-md italic text-white/90">The Soul of Craft.</p>
        </Reveal>
      </div>
    </section>
  );
}
