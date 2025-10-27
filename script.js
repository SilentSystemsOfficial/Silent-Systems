/* ===== Navbar Hamburger ===== */
function toggleMenu() {
    const navLinks = document.querySelector(".nav-links");
    navLinks.classList.toggle("show");
}

/* ===== Portfolio Modal ===== */
const projects = [
    {
        title: "Business Website",
        images: [
            "Images/Portfolio/Portfolio 1/Laptop 1.png",
            "Images/Portfolio/Portfolio 1/Laptop 2.png",
            "Images/Portfolio/Portfolio 1/Laptop 3.png",
            "Images/Portfolio/Portfolio 2/Mobile 1.png",
            "Images/Portfolio/Portfolio 2/Mobile 2.png",
            "Images/Portfolio/Portfolio 2/Mobile 3.png"
        ],
        description: "A sleek and responsive corporate website designed for professional service businesses. Includes custom layouts, call-to-action elements, and integrated contact form.",
        link: "Web Templates/Template 1/template.html"
    },
    {
        title: "E-Commerce Store",
        images: [
            "Images/Portfolio/Portfolio 2/Laptop.png",
            "Images/Portfolio/Portfolio 2/Laptop 1.png",
            "Images/Portfolio/Portfolio 2/Laptop 2.png",
            "Images/Portfolio/Portfolio 2/Mobile 1.png",
            "Images/Portfolio/Portfolio 2/Mobile 2.png",
            "Images/Portfolio/Portfolio 2/Mobile 3.png",
            "Images/Portfolio/Portfolio 2/Mobile 4.png",
            "Images/Portfolio/Portfolio 2/Mobile 5.png"
        ],
        description: "An interactive online store built with user-friendly navigation, product filtering, and secure checkout process — optimized for both desktop and mobile.",
        link: "Web Templates/Template 2/template.html"
    },
    {
        title: "Portfolio Gallery",
        images: [
            "Images/Portfolio/Portfolio 3/Laptop 1.png",
            "Images/Portfolio/Portfolio 3/Laptop 2.png"
        ],
        description: "A minimalist portfolio website for showcasing creative work. Features image gallery, category filters, and smooth animations.",
        link: "Web Templates/Template 3/template.html"
    }
];

let currentProject = 0;
let currentSlide = 0;

function openModal(index) {
    currentProject = index;
    currentSlide = 0;

    const modal = document.getElementById("portfolioModal");
    const slidesContainer = document.getElementById("slidesContainer");
    const modalDescription = document.getElementById("modalDescription");

    slidesContainer.innerHTML = projects[index].images
        .map((src, i) => `<img src="${src}" class="${i === 0 ? 'active' : ''}">`)
        .join("");

    modalDescription.innerHTML = `<h3>${projects[index].title}</h3><p>${projects[index].description}</p><a href="${projects[index].link}" target="_blank" class="view-template-btn">View Template ↗</a>`;
    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById("portfolioModal").style.display = "none";
}

function changeSlide(direction) {
    const slides = document.querySelectorAll("#slidesContainer img");
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
}

// Close modal when clicking outside
window.addEventListener("click", function(e) {
    const modal = document.getElementById("portfolioModal");
    if (e.target === modal) closeModal();
});

// Auto-hide scrollbar: show while scrolling or on mouse move, hide after idle
(function () {
  const SHOW_CLASS = 'show-scrollbar';
  const IDLE_DELAY = 900; // milliseconds to wait before hiding

  let timeoutId = null;

  function showScrollbarTemporarily() {
    document.body.classList.add(SHOW_CLASS);
    // clear any previous hide timeout
    if (timeoutId) clearTimeout(timeoutId);
    // hide after IDLE_DELAY ms of no scroll/mousemove
    timeoutId = setTimeout(() => {
      document.body.classList.remove(SHOW_CLASS);
      timeoutId = null;
    }, IDLE_DELAY);
  }

  // events that indicate user activity
  window.addEventListener('scroll', showScrollbarTemporarily, { passive: true });
  window.addEventListener('mousemove', showScrollbarTemporarily);
  window.addEventListener('touchstart', showScrollbarTemporarily, { passive: true });
  window.addEventListener('keydown', showScrollbarTemporarily);

  // optional: show briefly on page load
  window.addEventListener('load', () => {
    showScrollbarTemporarily();
  });
})();
// Disable right-click context menu
document.addEventListener('contextmenu', event => event.preventDefault());

// Disable common inspect shortcuts (Ctrl+Shift+I, F12, etc.)
document.addEventListener('keydown', event => {
  if (
    event.key === 'F12' || 
    (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J' || event.key === 'C')) ||
    (event.ctrlKey && event.key === 's') // Ctrl+U - View Source
  ) {
    event.preventDefault();
  }
});

// ========= Mobile Menu Toggle =========
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li a');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// ========= Active Section Highlight on Scroll =========
const sections = document.querySelectorAll('section[id]');
const navLinksArr = document.querySelectorAll('.nav-links li a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinksArr.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
});

