"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function HeroSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    // Delay video loading to ensure the main page loads fast first
    setShouldLoadVideo(true);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-surface-container">
        {/* Placeholder Image shown first */}
        <Image
          src="/assets/videos/temp_image.webp"
          alt="Timeless Elegance Background"
          fill
          priority
          className={`object-cover object-center transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-0' : 'opacity-80'}`}
        />

        {/* Video loads asynchronously */}
        {shouldLoadVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            onCanPlay={() => setIsVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-80' : 'opacity-0'}`}
          >
            <source src="/assets/videos/hero section video.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-primary/60 to-transparent"></div>
      </div>
      <div className="relative z-10 text-center px-margin-mobile flex flex-col items-center fade-in-section is-visible">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-surface-bright mb-6 max-w-3xl leading-tight">
          TIMELESS ELEGANCE,<br />REFINED.
        </h1>
        <p className="font-body-lg text-body-lg text-surface-bright/80 mb-10 max-w-xl mx-auto font-light">
          Discover the pinnacle of Swiss craftsmanship and modern design.
        </p>
        <a className="luxury-button px-8 py-4 border border-tertiary-fixed-dim text-surface-bright uppercase font-label-caps text-label-caps tracking-widest hover:bg-tertiary-fixed-dim/10 transition-colors duration-300" href="#collections">
          Shop the Collection
        </a>
      </div>
    </section>
  )
}

