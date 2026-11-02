(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Without GSAP, or when the visitor asked for less motion, the page stays
  // exactly as authored: everything visible, nothing animated.
  const bail = () => root.classList.remove("js");

  if (!window.gsap || !window.ScrollTrigger || reduceMotion) {
    bail();
    return;
  }

  const { gsap } = window;
  gsap.registerPlugin(window.ScrollTrigger);

  /* Hero: the two name lines rise out of their masked containers. */
  gsap.from(".display .line-inner", {
    yPercent: 115,
    duration: 1.1,
    ease: "power3.out",
    stagger: 0.08,
    delay: 0.1,
  });

  gsap.to(".reveal", {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: "power2.out",
    stagger: 0.12,
    delay: 0.35,
  });

  /* The stack separates with scroll depth and leans toward the pointer. */
  const hero = document.querySelector(".hero");
  const plates = gsap.utils.toArray(".plate");

  plates.forEach((plate, index) => {
    gsap.to(plate, {
      y: (index + 1) * -26,
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
      },
    });
  });

  const shiftX = gsap.quickTo("#plates", "x", { duration: 0.9, ease: "power2.out" });
  const shiftY = gsap.quickTo("#plates", "y", { duration: 0.9, ease: "power2.out" });

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    shiftX(x * 26);
    shiftY(y * 18);
  });

  /* Chapter headings and rules arrive one at a time. */
  gsap.utils.toArray(".chapter").forEach((chapter) => {
    const heading = chapter.querySelector("h2");
    if (heading) {
      gsap.from(heading, {
        opacity: 0,
        y: 18,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: chapter, start: "top 78%" },
      });
    }
  });

  /* Numbers count once, when the figure scrolls into view. */
  gsap.utils.toArray(".figure-value").forEach((node) => {
    const target = Number(node.dataset.countTo || 0);
    const counter = { value: 0 };

    gsap.to(counter, {
      value: target,
      duration: 1.4,
      ease: "power2.out",
      scrollTrigger: { trigger: node, start: "top 85%", once: true },
      onUpdate: () => {
        node.textContent = Math.round(counter.value);
      },
    });
  });

  gsap.utils.toArray(".timeline li").forEach((item) => {
    gsap.from(item, {
      opacity: 0,
      x: -12,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: { trigger: item, start: "top 88%" },
    });
  });
})();
