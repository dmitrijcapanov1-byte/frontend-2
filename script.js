// Ждем загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Инициализация AOS
  AOS.init({
    duration: 800,
    once: true,
    offset: 100
  });

  // 2. Инициализация GSAP
  if (typeof gsap !== 'undefined' && typeof SplitText !== 'undefined') {
    gsap.registerPlugin(SplitText);

    const split = new SplitText(".gsap-title", { type: "chars, words, lines" });

    gsap.from(split.chars, {
      duration: 0.8,
      y: 50,
      opacity: 0,
      rotationX: -90,
      transformOrigin: "0% 50% -50",
      stagger: 0.03,
      ease: "back.out(1.7)",
      delay: 0.3
    });
  }
});