/*
 * BANNERS INTERAPP
 * Para agregar más imágenes:
 * 1. Copia el archivo en assets/images/banners/
 * 2. Agrega una entrada al arreglo slides con image y alt.
 */
const slides = [
  {
    image: "banners/banner-01.webp",
    alt: "Intercambia, conecta y transforma: personas compartiendo productos."
  },
  {
    image: "banners/banner-02.webp",
    alt: "Miles de cosas, nuevas historias: ropa, tecnología, hogar y libros."
  },
  {
    image: "banners/banner-03.webp",
    alt: "Comunidad de intercambio sostenible y reutilización."
  },
  {
    image: "banners/banner-04.webp",
    alt: "Tu próximo intercambio te espera."
  }
];

document.querySelectorAll("[data-interapp-banner]").forEach((container) => {
  const prefix = container.dataset.imagePrefix || "assets/images/";
  const actionHref = container.dataset.actionHref || "#";
  const actionText = container.dataset.actionText || "Descubrir";
  let activeIndex = 0;
  let timer = null;

  if (!slides.length) {
    container.remove();
    return;
  }

  container.innerHTML = `
    <div class="banner-carousel" aria-roledescription="carrusel" aria-label="Banners de InterApp">
      <div class="banner-carousel-track"></div>
      <button class="banner-arrow banner-prev" type="button" aria-label="Imagen anterior">‹</button>
      <button class="banner-arrow banner-next" type="button" aria-label="Imagen siguiente">›</button>
      <div class="banner-indicators" aria-label="Seleccionar imagen"></div>
      <a class="banner-action" href="${actionHref}">${actionText}</a>
    </div>
  `;

  const track = container.querySelector(".banner-carousel-track");
  const indicators = container.querySelector(".banner-indicators");

  slides.forEach((slide, index) => {
    const item = document.createElement("div");
    item.className = `banner-slide${index === 0 ? " is-active" : ""}`;

    const image = document.createElement("img");
    image.src = prefix + slide.image;
    image.alt = slide.alt;
    image.loading = index === 0 ? "eager" : "lazy";
    image.className = "landing-banner-image";
    image.onerror = () => {
      item.innerHTML = `<div class="banner-fallback">No se pudo cargar ${slide.image}. Verifica que el archivo esté en assets/images/.</div>`;
    };

    item.appendChild(image);
    track.appendChild(item);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `banner-dot${index === 0 ? " is-active" : ""}`;
    dot.setAttribute("aria-label", `Mostrar imagen ${index + 1}`);
    dot.setAttribute("aria-current", index === 0 ? "true" : "false");
    dot.addEventListener("click", () => {
      showSlide(index);
      startTimer();
    });
    indicators.appendChild(dot);
  });

  function showSlide(nextIndex) {
    activeIndex = (nextIndex + slides.length) % slides.length;
    track.querySelectorAll(".banner-slide").forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeIndex);
    });
    indicators.querySelectorAll(".banner-dot").forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
      dot.setAttribute("aria-current", index === activeIndex ? "true" : "false");
    });
  }

  function stopTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function startTimer() {
    stopTimer();
    timer = window.setInterval(() => showSlide(activeIndex + 1), 5000);
  }

  container.querySelector(".banner-prev").addEventListener("click", () => {
    showSlide(activeIndex - 1);
    startTimer();
  });
  container.querySelector(".banner-next").addEventListener("click", () => {
    showSlide(activeIndex + 1);
    startTimer();
  });

  container.addEventListener("mouseenter", stopTimer);
  container.addEventListener("mouseleave", startTimer);
  container.addEventListener("focusin", stopTimer);
  container.addEventListener("focusout", startTimer);
  startTimer();
});
