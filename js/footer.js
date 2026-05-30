// footer.js — Footer Component
(function () {
  const year = new Date().getFullYear();
  const html = `
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/" class="logo">
            <span class="logo-icon">🎡</span> NamesWheel
          </a>
          <p>The free, fun, and fast spin-the-wheel random picker. Add names, spin, and let fate decide. Perfect for classrooms, giveaways, parties, and everyday decisions.</p>
          <div style="margin-top:16px;display:flex;gap:12px">
            <a href="#spinner" style="background:linear-gradient(135deg,#ff6b6b,#a855f7);color:white;padding:10px 20px;border-radius:100px;text-decoration:none;font-weight:800;font-size:0.85rem">🎡 Spin Now</a>
          </div>
        </div>
        <div class="footer-col">
          <h5>Wheel Types</h5>
          <ul>
            <li><a href="#spinner" onclick="switchWheel('names')">Names Wheel</a></li>
            <li><a href="#spinner" onclick="switchWheel('yesno')">Yes / No Wheel</a></li>
            <li><a href="#spinner" onclick="switchWheel('numbers')">Number Wheel</a></li>
            <li><a href="#spinner" onclick="switchWheel('colors')">Color Wheel</a></li>
            <li><a href="#spinner" onclick="switchWheel('truth')">Truth or Dare</a></li>
            <li><a href="#spinner" onclick="switchWheel('custom')">Custom Wheel</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Popular Uses</h5>
          <ul>
            <li><a href="/#uses">Classroom Picker</a></li>
            <li><a href="/#uses">Giveaway Winner</a></li>
            <li><a href="/#uses">Party Games</a></li>
            <li><a href="/#uses">Decision Maker</a></li>
            <li><a href="/#uses">Team Selector</a></li>
            <li><a href="/#uses">Stream Giveaway</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/#how">How It Works</a></li>
            <li><a href="/#features">Features</a></li>
            <li><a href="/#about">About</a></li>
            <li><a href="/#faq">FAQ</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© ${year} NamesWheel — nameswheel.github.io. All rights reserved.</p>
        <div class="footer-bottom-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
          <a href="/contact">Contact</a>
          <a href="/about">About</a>
          <a href="/cookie">Cookies Policy</a>
        </div>
      </div>
    </div>
  </footer>`;
  document.getElementById('footer-root').innerHTML = html;
})();
