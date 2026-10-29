const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    menuToggle.textContent = isOpen ? "×" : "☰";
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
      menuToggle.textContent = "☰";
    });
  });
}


// Carrusel accesible de fotografías
const slides = Array.from(document.querySelectorAll(".gallery-slide"));
const dots = Array.from(document.querySelectorAll(".carousel-dot"));
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");
let activeSlide = 0;

function showSlide(index) {
  if (!slides.length) return;
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    const active = i === activeSlide;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
  });
  dots.forEach((dot, i) => {
    const active = i === activeSlide;
    dot.classList.toggle("active", active);
    dot.setAttribute("aria-pressed", String(active));
  });
}

prevSlide?.addEventListener("click", () => showSlide(activeSlide - 1));
nextSlide?.addEventListener("click", () => showSlide(activeSlide + 1));
dots.forEach((dot, i) => dot.addEventListener("click", () => showSlide(i)));


// Avance automático cada 5 segundos; se pausa cuando el usuario interactúa con el carrusel.
const carousel = document.querySelector(".carousel");
let carouselTimer = null;
function startCarousel() {
  if (!slides.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  stopCarousel();
  carouselTimer = window.setInterval(() => showSlide(activeSlide + 1), 5000);
}
function stopCarousel() {
  if (carouselTimer !== null) {
    window.clearInterval(carouselTimer);
    carouselTimer = null;
  }
}
carousel?.addEventListener("mouseenter", stopCarousel);
carousel?.addEventListener("mouseleave", startCarousel);
carousel?.addEventListener("focusin", stopCarousel);
carousel?.addEventListener("focusout", startCarousel);
prevSlide?.addEventListener("click", startCarousel);
nextSlide?.addEventListener("click", startCarousel);
dots.forEach(dot => dot.addEventListener("click", startCarousel));
startCarousel();


// Carrusel de auspiciantes: orden aleatorio en cada carga y avance automático.
const sponsorTrack = document.getElementById("sponsorTrack");
const sponsorPrev = document.getElementById("sponsorPrev");
const sponsorNext = document.getElementById("sponsorNext");
const sponsorStatus = document.getElementById("sponsorStatus");
const sponsorCarousel = document.querySelector(".sponsor-carousel");
let sponsorIndex = 0;
let sponsorTimer = null;

function shuffleCards(cards) {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function sponsorVisibleCount() {
  if (window.matchMedia("(max-width: 480px)").matches) return 1;
  if (window.matchMedia("(max-width: 760px)").matches) return 2;
  return 3;
}

function updateSponsors() {
  if (!sponsorTrack) return;
  const cards = Array.from(sponsorTrack.querySelectorAll(".sponsor-card"));
  const visible = sponsorVisibleCount();
  const maxIndex = Math.max(0, cards.length - visible);
  sponsorIndex = Math.min(sponsorIndex, maxIndex);
  const firstCard = cards[0];
  if (!firstCard) return;
  const gap = parseFloat(getComputedStyle(sponsorTrack).gap) || 0;
  const distance = firstCard.getBoundingClientRect().width + gap;
  sponsorTrack.style.transform = `translateX(${-sponsorIndex * distance}px)`;
  if (sponsorStatus) sponsorStatus.textContent = `${Math.min(sponsorIndex + visible, cards.length)} de ${cards.length} auspiciantes`;
}

function moveSponsorCarousel(direction) {
  if (!sponsorTrack) return;
  const cards = sponsorTrack.querySelectorAll(".sponsor-card");
  const maxIndex = Math.max(0, cards.length - sponsorVisibleCount());
  sponsorIndex += direction;
  if (sponsorIndex > maxIndex) sponsorIndex = 0;
  if (sponsorIndex < 0) sponsorIndex = maxIndex;
  updateSponsors();
}

function stopSponsorCarousel() {
  if (sponsorTimer !== null) {
    window.clearInterval(sponsorTimer);
    sponsorTimer = null;
  }
}
function startSponsorCarousel() {
  stopSponsorCarousel();
  if (!sponsorTrack || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  sponsorTimer = window.setInterval(() => moveSponsorCarousel(1), 4500);
}

if (sponsorTrack) {
  const randomizedCards = shuffleCards(Array.from(sponsorTrack.querySelectorAll(".sponsor-card")));
  randomizedCards.forEach(card => sponsorTrack.appendChild(card));
  sponsorPrev?.addEventListener("click", () => { moveSponsorCarousel(-1); startSponsorCarousel(); });
  sponsorNext?.addEventListener("click", () => { moveSponsorCarousel(1); startSponsorCarousel(); });
  sponsorCarousel?.addEventListener("mouseenter", stopSponsorCarousel);
  sponsorCarousel?.addEventListener("mouseleave", startSponsorCarousel);
  sponsorCarousel?.addEventListener("focusin", stopSponsorCarousel);
  sponsorCarousel?.addEventListener("focusout", startSponsorCarousel);
  window.addEventListener("resize", updateSponsors);
  updateSponsors();
  startSponsorCarousel();
}
