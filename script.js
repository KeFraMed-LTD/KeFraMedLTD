// =============================
// KeFraMed LTD - script.js
// =============================

// Smooth scrolling for nav links
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const section = document.querySelector(this.getAttribute("href"));
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Hero button scrolls to products
const heroBtn = document.querySelector(".hero button");
if (heroBtn) {
  heroBtn.addEventListener("click", () => {
    const section = document.querySelector("#products");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  });
});

// Add year dynamically in footer
const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}
