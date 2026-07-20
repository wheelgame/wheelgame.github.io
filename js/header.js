// header.js — Header Component
(function () {
  const html = `
  <header class="site-header" id="siteHeader">
    <div class="header-inner">
      <a href="/" class="logo">
        <img src="/logo.png" alt="Names on Wheel Logo" class="logo-image">
        Spin The Wheel
      </a>
      <nav>
        <ul class="nav-links" id="navLinks">
          <li><a href="/">Home</a></li>
          <li><a href="/#spinner">Spin Wheel</a></li>
          <li><a href="/#features">Features</a></li>
          <li><a href="/#uses">Uses</a></li>
          <li><a href="/#faq">FAQ</a></li>
          <li><a href="/#spinner" class="nav-cta">🎡 Spin Now</a></li>
        </ul>
        <button class="hamburger" id="hamburger" aria-label="Menu" onclick="toggleMobileNav()">
          <span class="ham-line"></span>
          <span class="ham-line"></span>
          <span class="ham-line"></span>
        </button>
      </nav>
    </div>
    <div class="mobile-nav" id="mobileNav">
      <div class="mobile-nav-inner">
        <a href="/" onclick="closeMobileNav()">🏠 Home</a>
        <a href="/#spinner" onclick="closeMobileNav()">🎡 Spin Wheel</a>
        <a href="/#wheel-types" onclick="closeMobileNav()">🎨 Wheel Types</a>
        <a href="/#features" onclick="closeMobileNav()">⚡ Features</a>
        <a href="/#uses" onclick="closeMobileNav()">💡 Uses</a>
        <a href="/about" onclick="closeMobileNav()">ℹ️ About</a>
        <a href="/#faq" onclick="closeMobileNav()">❓ FAQ</a>
        <a href="/#spinner" onclick="closeMobileNav()" class="mobile-cta">🎡 Spin Now</a>
      </div>
    </div>
  </header>`;
  document.getElementById('header-root').innerHTML = html;

  // Scroll shadow
  window.addEventListener('scroll', () => {
    const h = document.getElementById('siteHeader');
    if (h) h.style.boxShadow = window.scrollY > 20 ? '0 4px 30px rgba(0,0,0,0.1)' : '0 2px 20px rgba(0,0,0,0.06)';
  });
})();

function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  const ham = document.getElementById('hamburger');
  nav.classList.toggle('open');
  ham.classList.toggle('open');
  // Prevent body scroll when menu is open
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
}
function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
  document.body.style.overflow = '';
}
