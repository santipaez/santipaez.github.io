(() => {
  const root = document.documentElement;

  // The motion is the design here, so it runs regardless of the operating
  // system preference. Without GSAP the page stays fully readable.
  const bail = () => root.classList.remove("js");

  if (!window.gsap || !window.ScrollTrigger) {
    bail();
    return;
  }

  const { gsap } = window;
  gsap.registerPlugin(window.ScrollTrigger);

  /* ---- hero ---- */

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

  const planes = document.querySelector(".planes");

  if (planes) {
    const tiltX = gsap.quickTo(planes, "rotationX", { duration: 1, ease: "power2.out" });
    const tiltY = gsap.quickTo(planes, "rotationY", { duration: 1, ease: "power2.out" });

    window.addEventListener("pointermove", (event) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      tiltY(x * 16);
      tiltX(y * -12);
    });

    gsap.to(planes, {
      rotationZ: 9,
      y: -54,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.9,
      },
    });
  }

  /* ---- pinned narrative ---- */

  const pinned = document.querySelector(".chapter-pinned");

  if (pinned) {
    pinned.classList.add("is-pinned");

    const steps = gsap.utils.toArray(".pin-step");

    if (steps.length > 2) {
      // Short transitions with a held slot each, plus snapping, so the page
      // never parks on a half-faded step.
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".pin",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          snap: {
            snapTo: 1 / (steps.length - 1),
            duration: 0.3,
            ease: "power2.inOut",
            delay: 0.05,
          },
        },
      });

      steps.forEach((step, index) => {
        if (index === 0) {
          return;
        }
        timeline
          .to(steps[index - 1], { opacity: 0, y: -22, duration: 0.1 }, index - 0.95)
          .to(step, { opacity: 1, y: 0, duration: 0.1 }, index - 0.9)
          .to({}, { duration: 0.9 });
      });
    }
  }

  /* ---- reading progress ---- */

  gsap.to(".rail-fill", {
    scaleY: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
    },
  });

  /* ---- figures and timeline ---- */

  gsap.utils.toArray(".chapter").forEach((chapter) => {
    const heading = chapter.querySelector("h2");
    if (!heading) {
      return;
    }
    gsap.from(heading, {
      opacity: 0,
      y: 18,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: { trigger: chapter, start: "top 78%" },
    });
  });

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

  /* ---- cursor ---- */

  const cursor = document.querySelector(".cursor");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (cursor && finePointer) {
    const moveX = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" });

    window.addEventListener("pointermove", (event) => {
      moveX(event.clientX);
      moveY(event.clientY);
      cursor.classList.add("is-active");
    });

    document.querySelectorAll("a, .case, .timeline li").forEach((node) => {
      node.addEventListener("pointerenter", () => cursor.classList.add("is-over"));
      node.addEventListener("pointerleave", () => cursor.classList.remove("is-over"));
    });

    document.addEventListener("pointerleave", () => cursor.classList.remove("is-active"));
  }
})();
