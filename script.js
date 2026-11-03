/**
 * script.js
 * Основной файл скриптов для проекта "СДВИГ"
 * Включает в себя: AOS, GSAP (SplitText) и Three.js
 * С учетом доступности (prefers-reduced-motion)
 */

document.addEventListener("DOMContentLoaded", () => {
  
  // Проверяем, не отключил ли пользователь анимации в системе
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================
  // 1. ИНИЦИАЛИЗАЦИЯ AOS (Animate On Scroll)
  // ==========================================
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800, // Длительность анимации
      once: true,    // Срабатывает только один раз
      offset: 100,   // Смещение срабатывания
      disable: prefersReducedMotion // Отключаем, если пользователь против анимаций
    });
  } else {
    console.warn("Библиотека AOS не загружена.");
  }

  // ==========================================
  // 2. ИНИЦИАЛИЗАЦИЯ GSAP + SPLITTEXT (Текст по буквам)
  // ==========================================
  // Запускаем только если анимации разрешены и библиотеки загружены
  if (!prefersReducedMotion && typeof gsap !== 'undefined' && typeof SplitText !== 'undefined') {
    gsap.registerPlugin(SplitText);

    const titleElement = document.querySelector(".gsap-title");
    
    if (titleElement) {
      // Разбиваем текст на символы
      const split = new SplitText(titleElement, { type: "chars, words, lines" });

      // Анимация появления букв
      gsap.from(split.chars, {
        duration: 0.8,
        y: 50,
        opacity: 0,
        rotationX: -90,
        transformOrigin: "0% 50% -50",
        stagger: 0.03, // Задержка между буквами
        ease: "back.out(1.7)",
        delay: 0.3
      });
    }
  } else if (!prefersReducedMotion) {
    console.warn("GSAP или SplitText не загружены.");
  }

  // ==========================================
  // 3. THREE.JS (3D-ЧАСТИЦЫ НА ФОНЕ)
  // ==========================================
  // Запускаем только если анимации разрешены и Three.js загружен
  if (!prefersReducedMotion && typeof THREE !== 'undefined') {
    const container = document.getElementById('canvas-container');
    
    if (container) {
      // 1. Сцена
      const scene = new THREE.Scene();
      
      // 2. Камера
      const camera = new THREE.PerspectiveCamera(
        75, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
      );
      camera.position.z = 5;

      // 3. Рендерер (alpha: true делает фон прозрачным)
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Оптимизация для Retina
      container.appendChild(renderer.domElement);

      // 4. Геометрия и материал для частиц
      const geometry = new THREE.BufferGeometry();
      const particlesCount = 800; // Количество частиц
      const posArray = new Float32Array(particlesCount * 3); // Массив координат (x, y, z)

      for (let i = 0; i < particlesCount * 3; i++) {
        // Разбрасываем частицы случайно в пространстве
        posArray[i] = (Math.random() - 0.5) * 10;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      
      const material = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xff5c35, // Наш оранжевый акцент
        transparent: true,
        opacity: 0.8
      });

      const particlesMesh = new THREE.Points(geometry, material);
      scene.add(particlesMesh);

      // 5. Анимация
      const clock = new THREE.Clock();
      
      function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();
        
        // Медленное вращение всей системы
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;
        
        // Легкое покачивание вверх-вниз
        particlesMesh.position.y = Math.sin(elapsedTime * 0.5) * 0.1;

        renderer.render(scene, camera);
      }
      
      animate();

      // 6. Адаптивность (если поменялся размер окна)
      window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      });
    }
  } else if (!prefersReducedMotion) {
    console.warn("Three.js не загружен.");
  }

});