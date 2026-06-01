"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function FadeObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Intersection Observer for Fade-in Animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const intersectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const observeElements = () => {
      const elements = document.querySelectorAll('.fade-in-section:not(.is-visible)');
      elements.forEach((section) => {
        intersectionObserver.observe(section);
        
        // Failsafe for elements already in viewport
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          section.classList.add('is-visible');
          intersectionObserver.unobserve(section);
        }
      });
    };

    // Initial observation
    setTimeout(observeElements, 100);

    // MutationObserver to watch for newly added elements (e.g. from Suspense resolving)
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]); // Re-run effect when the route changes

  return null;
}

