export interface DefaultComponent {
  id: string;
  name: string;
  selector: string;
  position: 'before' | 'after';
  html: string;
  css: string;
  javascript: string;
  isActive?: boolean;
}

export const defaultComponents: DefaultComponent[] = [
  {
    id: 'cookie-consent',
    name: 'Cookie Consent Banner',
    selector: 'body',
    position: 'after',
    html: `<div class="cookie-banner">
      <p>Bu site çerezleri kullanmaktadır.</p>
      <button class="accept-btn">Kabul Et</button>
      <button class="reject-btn">Reddet</button>
    </div>`,
    css: `.cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #f8f9fa;
      padding: 1rem;
      text-align: center;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
      z-index: 9999;
      transform: translateY(100%);
      transition: transform 0.3s ease-in-out;
    }
    .cookie-banner.show {
      transform: translateY(0);
    }
    .accept-btn, .reject-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      margin: 0 0.5rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .reject-btn {
      background: #6c757d;
    }
    .accept-btn:hover { background: #0056b3; }
    .reject-btn:hover { background: #5a6268; }`,
    javascript: `(function() {
      const banner = document.querySelector('.cookie-banner');
      const acceptBtn = banner.querySelector('.accept-btn');
      const rejectBtn = banner.querySelector('.reject-btn');
      
      // Show banner if no preference is set
      if (!localStorage.getItem('cookiePreference')) {
        setTimeout(() => {
          banner.classList.add('show');
        }, 1000);
      }
      
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiePreference', 'accepted');
        banner.classList.remove('show');
        // Trigger custom event
        window.dispatchEvent(new CustomEvent('cookiePreferenceSet', {
          detail: { accepted: true }
        }));
      });
      
      rejectBtn.addEventListener('click', () => {
        localStorage.setItem('cookiePreference', 'rejected');
        banner.classList.remove('show');
        // Trigger custom event
        window.dispatchEvent(new CustomEvent('cookiePreferenceSet', {
          detail: { accepted: false }
        }));
      });
    })();`
  },
  {
    id: 'feedback-form',
    name: 'Geri Bildirim Formu',
    selector: 'body',
    position: 'after',
    html: `<div class="feedback-widget">
      <button class="feedback-toggle">Geri Bildirim</button>
      <div class="feedback-form">
        <div class="feedback-header">
          <h3>Geri Bildirim</h3>
          <button class="close-feedback">&times;</button>
        </div>
        <div class="feedback-content">
          <select class="feedback-type">
            <option value="">Konu Seçin</option>
            <option value="bug">Hata Bildirimi</option>
            <option value="feature">Özellik Önerisi</option>
            <option value="other">Diğer</option>
          </select>
          <textarea placeholder="Düşüncelerinizi yazın..." class="feedback-text"></textarea>
          <div class="feedback-rating">
            <span>Memnuniyet:</span>
            <div class="stars">
              <span class="star" data-rating="1">★</span>
              <span class="star" data-rating="2">★</span>
              <span class="star" data-rating="3">★</span>
              <span class="star" data-rating="4">★</span>
              <span class="star" data-rating="5">★</span>
            </div>
          </div>
          <button class="submit-btn">Gönder</button>
        </div>
      </div>
    </div>`,
    css: `.feedback-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }
    .feedback-toggle {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 20px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .feedback-toggle:hover {
      transform: translateY(-2px);
    }
    .feedback-form {
      position: absolute;
      bottom: calc(100% + 20px);
      right: 0;
      width: 300px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 20px rgba(0,0,0,0.1);
      display: none;
      transform: scale(0.95);
      transition: transform 0.2s;
    }
    .feedback-form.show {
      display: block;
      transform: scale(1);
    }
    .feedback-header {
      padding: 15px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .close-feedback {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      opacity: 0.7;
    }
    .feedback-content {
      padding: 15px;
    }
    .feedback-type {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .feedback-text {
      width: 100%;
      min-height: 100px;
      padding: 8px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      resize: vertical;
    }
    .feedback-rating {
      margin: 10px 0;
    }
    .stars {
      display: inline-block;
      margin-left: 10px;
    }
    .star {
      color: #ddd;
      cursor: pointer;
      font-size: 20px;
      transition: color 0.2s;
    }
    .star.active {
      color: #ffd700;
    }
    .submit-btn {
      width: 100%;
      background: #28a745;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .submit-btn:hover {
      background: #218838;
    }`,
    javascript: `class FeedbackWidget {
      constructor() {
        this.widget = document.querySelector('.feedback-widget');
        this.form = this.widget.querySelector('.feedback-form');
        this.toggle = this.widget.querySelector('.feedback-toggle');
        this.closeBtn = this.widget.querySelector('.close-feedback');
        this.submitBtn = this.widget.querySelector('.submit-btn');
        this.stars = this.widget.querySelectorAll('.star');
        this.rating = 0;
        
        this.initializeEvents();
      }
      
      initializeEvents() {
        // Toggle form
        this.toggle.addEventListener('click', () => {
          this.form.classList.toggle('show');
        });
        
        // Close form
        this.closeBtn.addEventListener('click', () => {
          this.form.classList.remove('show');
        });
        
        // Star rating
        this.stars.forEach(star => {
          star.addEventListener('click', (e) => {
            const rating = parseInt(e.target.dataset.rating);
            this.setRating(rating);
          });
        });
        
        // Submit form
        this.submitBtn.addEventListener('click', () => {
          this.submitFeedback();
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
          if (!this.widget.contains(e.target)) {
            this.form.classList.remove('show');
          }
        });
      }
      
      setRating(rating) {
        this.rating = rating;
        this.stars.forEach(star => {
          const starRating = parseInt(star.dataset.rating);
          star.classList.toggle('active', starRating <= rating);
        });
      }
      
      submitFeedback() {
        const type = this.widget.querySelector('.feedback-type').value;
        const text = this.widget.querySelector('.feedback-text').value;
        
        if (!type || !text || this.rating === 0) {
          alert('Lütfen tüm alanları doldurun!');
          return;
        }
        
        const feedback = {
          type,
          text,
          rating: this.rating,
          timestamp: new Date().toISOString()
        };
        
        // Trigger custom event with feedback data
        const event = new CustomEvent('feedbackSubmitted', {
          detail: feedback
        });
        window.dispatchEvent(event);
        
        // Reset form
        this.widget.querySelector('.feedback-type').value = '';
        this.widget.querySelector('.feedback-text').value = '';
        this.setRating(0);
        this.form.classList.remove('show');
        
        // Show success message
        alert('Geri bildiriminiz için teşekkürler!');
      }
    }
    
    // Initialize widget
    new FeedbackWidget();`
  },
  {
    id: 'social-share',
    name: 'Sosyal Medya Paylaşım',
    selector: 'body',
    position: 'after',
    html: `<div class="social-share">
      <button class="share-toggle">Paylaş</button>
      <div class="share-buttons">
        <button class="share-btn twitter" data-platform="twitter">
          <i class="icon">𝕏</i>
          <span>Twitter</span>
        </button>
        <button class="share-btn facebook" data-platform="facebook">
          <i class="icon">f</i>
          <span>Facebook</span>
        </button>
        <button class="share-btn linkedin" data-platform="linkedin">
          <i class="icon">in</i>
          <span>LinkedIn</span>
        </button>
        <button class="share-btn whatsapp" data-platform="whatsapp">
          <i class="icon">w</i>
          <span>WhatsApp</span>
        </button>
        <button class="share-btn copy" data-platform="copy">
          <i class="icon">📋</i>
          <span>Linki Kopyala</span>
        </button>
      </div>
    </div>`,
    css: `.social-share {
      position: fixed;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1000;
    }
    .share-toggle {
      background: #333;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 20px;
      cursor: pointer;
      margin-bottom: 10px;
      transition: background 0.2s;
    }
    .share-toggle:hover {
      background: #444;
    }
    .share-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
      opacity: 0;
      transform: translateX(-20px);
      transition: all 0.3s;
      pointer-events: none;
    }
    .share-buttons.show {
      opacity: 1;
      transform: translateX(0);
      pointer-events: all;
    }
    .share-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      color: white;
      cursor: pointer;
      transition: transform 0.2s;
      width: 140px;
    }
    .share-btn:hover {
      transform: translateX(5px);
    }
    .twitter { background: #1da1f2; }
    .facebook { background: #4267B2; }
    .linkedin { background: #0077b5; }
    .whatsapp { background: #25D366; }
    .copy { background: #6c757d; }
    .icon {
      font-style: normal;
      font-weight: bold;
    }`,
    javascript: `class SocialShare {
      constructor() {
        this.container = document.querySelector('.social-share');
        this.toggle = this.container.querySelector('.share-toggle');
        this.buttons = this.container.querySelector('.share-buttons');
        this.shareButtons = this.container.querySelectorAll('.share-btn');
        
        this.initializeEvents();
      }
      
      initializeEvents() {
        // Toggle share buttons
        this.toggle.addEventListener('click', () => {
          this.buttons.classList.toggle('show');
        });
        
        // Share buttons click handlers
        this.shareButtons.forEach(button => {
          button.addEventListener('click', (e) => {
            const platform = e.currentTarget.dataset.platform;
            this.share(platform);
          });
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
          if (!this.container.contains(e.target)) {
            this.buttons.classList.remove('show');
          }
        });
      }
      
      share(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        
        let shareUrl = '';
        
        switch(platform) {
          case 'twitter':
            shareUrl = \`https://twitter.com/intent/tweet?url=\${url}&text=\${title}\`;
            break;
          case 'facebook':
            shareUrl = \`https://www.facebook.com/sharer/sharer.php?u=\${url}\`;
            break;
          case 'linkedin':
            shareUrl = \`https://www.linkedin.com/sharing/share-offsite/?url=\${url}\`;
            break;
          case 'whatsapp':
            shareUrl = \`https://wa.me/?text=\${title}%20\${url}\`;
            break;
          case 'copy':
            this.copyToClipboard(window.location.href);
            return;
        }
        
        if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      }
      
      copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
          const originalText = this.container.querySelector('.copy span').textContent;
          this.container.querySelector('.copy span').textContent = 'Kopyalandı!';
          
          setTimeout(() => {
            this.container.querySelector('.copy span').textContent = originalText;
          }, 2000);
        });
      }
    }
    
    // Initialize social share
    new SocialShare();`
  },
  {
    id: 'live-chat',
    name: 'Canlı Destek',
    selector: 'body',
    position: 'after',
    html: `<div class="chat-widget">
      <div class="chat-header">
        <h4>Canlı Destek</h4>
        <span class="minimize">_</span>
      </div>
      <div class="chat-body">
        <div class="messages"></div>
        <input type="text" placeholder="Mesajınızı yazın...">
      </div>
    </div>`,
    css: `.chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 300px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .chat-header {
      background: #007bff;
      color: white;
      padding: 10px;
      border-radius: 8px 8px 0 0;
      display: flex;
      justify-content: space-between;
    }
    .chat-body {
      padding: 10px;
    }
    .messages {
      height: 200px;
      overflow-y: auto;
    }
    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-top: 10px;
    }`,
    javascript: ``
  },
  {
    id: 'countdown-timer',
    name: 'Geri Sayım Sayacı',
    selector: 'body',
    position: 'after',
    html: `<div class="countdown">
      <div class="time-block">
        <span class="days">00</span>
        <span>Gün</span>
      </div>
      <div class="time-block">
        <span class="hours">00</span>
        <span>Saat</span>
      </div>
      <div class="time-block">
        <span class="minutes">00</span>
        <span>Dakika</span>
      </div>
      <div class="time-block">
        <span class="seconds">00</span>
        <span>Saniye</span>
      </div>
    </div>`,
    css: `.countdown {
      display: flex;
      justify-content: center;
      gap: 20px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .time-block {
      text-align: center;
    }
    .time-block span:first-child {
      font-size: 2em;
      font-weight: bold;
      display: block;
    }`,
    javascript: `function updateCountdown() {
      const target = new Date('2024-12-31').getTime();
      const now = new Date().getTime();
      const diff = target - now;
      
      document.querySelector('.days').textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
      document.querySelector('.hours').textContent = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      document.querySelector('.minutes').textContent = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      document.querySelector('.seconds').textContent = Math.floor((diff % (1000 * 60)) / 1000);
    }
    setInterval(updateCountdown, 1000);`
  },
  {
    id: 'newsletter-popup',
    name: 'Bülten Kayıt Popup',
    selector: 'body',
    position: 'after',
    html: `<div class="newsletter-popup">
      <span class="close">&times;</span>
      <h3>Bültenimize Katılın</h3>
      <p>En son haberler ve güncellemeler için kaydolun.</p>
      <input type="email" placeholder="E-posta adresiniz">
      <button>Kaydol</button>
    </div>`,
    css: `.newsletter-popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 20px rgba(0,0,0,0.2);
      text-align: center;
      max-width: 400px;
      width: 90%;
    }
    .close {
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
    }
    input {
      width: 100%;
      padding: 8px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    }`,
    javascript: `document.querySelector('.close').addEventListener('click', function() {
      document.querySelector('.newsletter-popup').style.display = 'none';
    });`
  },
  {
    id: 'floating-cart',
    name: 'Yüzen Sepet',
    selector: 'body',
    position: 'after',
    html: `<div class="floating-cart">
      <div class="cart-icon">🛒</div>
      <span class="cart-count">0</span>
    </div>`,
    css: `.floating-cart {
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      padding: 10px;
      border-radius: 50%;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      cursor: pointer;
    }
    .cart-icon {
      font-size: 24px;
    }
    .cart-count {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #dc3545;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }`,
    javascript: ``
  },
  {
    id: 'search-overlay',
    name: 'Arama Overlay',
    selector: 'body',
    position: 'after',
    html: `<div class="search-overlay">
      <div class="search-container">
        <input type="text" placeholder="Ara...">
        <button class="close-search">&times;</button>
      </div>
    </div>`,
    css: `.search-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.9);
      display: none;
      z-index: 1000;
    }
    .search-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      max-width: 600px;
    }
    input {
      width: 100%;
      padding: 15px;
      font-size: 20px;
      border: none;
      border-radius: 4px;
    }
    .close-search {
      position: absolute;
      top: -40px;
      right: 0;
      color: white;
      font-size: 30px;
      border: none;
      background: none;
      cursor: pointer;
    }`,
    javascript: `document.querySelector('.close-search').addEventListener('click', function() {
      document.querySelector('.search-overlay').style.display = 'none';
    });`
  },
  {
    id: 'language-switcher',
    name: 'Dil Değiştirici',
    selector: 'body',
    position: 'after',
    html: `<div class="language-switcher">
      <button class="current-lang">TR</button>
      <div class="lang-dropdown">
        <a href="#" data-lang="tr">Türkçe</a>
        <a href="#" data-lang="en">English</a>
        <a href="#" data-lang="de">Deutsch</a>
      </div>
    </div>`,
    css: `.language-switcher {
      position: fixed;
      top: 20px;
      right: 20px;
    }
    .current-lang {
      background: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    .lang-dropdown {
      display: none;
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border-radius: 4px;
      overflow: hidden;
    }
    .lang-dropdown a {
      display: block;
      padding: 8px 16px;
      text-decoration: none;
      color: #333;
    }
    .lang-dropdown a:hover {
      background: #f8f9fa;
    }`,
    javascript: `document.querySelector('.current-lang').addEventListener('click', function() {
      document.querySelector('.lang-dropdown').style.display = 
        document.querySelector('.lang-dropdown').style.display === 'block' ? 'none' : 'block';
    });`
  },
  {
    id: 'dark-mode-toggle',
    name: 'Karanlık Mod Düğmesi',
    selector: 'body',
    position: 'after',
    html: `<button class="dark-mode-toggle">🌓</button>`,
    css: `.dark-mode-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      border: none;
      padding: 10px;
      border-radius: 50%;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      cursor: pointer;
      font-size: 20px;
    }
    [data-theme="dark"] {
      background: #1a1a1a;
      color: #fff;
    }`,
    javascript: `document.querySelector('.dark-mode-toggle').addEventListener('click', function() {
      document.body.setAttribute('data-theme',
        document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
      );
    });`
  },
  {
    id: 'accordion',
    name: 'Akordeon Menü',
    selector: '.accordion',
    position: 'after',
    html: `<div class="accordion">
      <div class="accordion-item">
        <div class="accordion-header">Başlık 1</div>
        <div class="accordion-content">İçerik 1</div>
      </div>
      <div class="accordion-item">
        <div class="accordion-header">Başlık 2</div>
        <div class="accordion-content">İçerik 2</div>
      </div>
    </div>`,
    css: `.accordion-item {
      border: 1px solid #ddd;
      margin-bottom: -1px;
    }
    .accordion-header {
      padding: 15px;
      background: #f8f9fa;
      cursor: pointer;
    }
    .accordion-content {
      padding: 15px;
      display: none;
    }
    .accordion-item.active .accordion-content {
      display: block;
    }`,
    javascript: `document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', function() {
        const item = this.parentElement;
        const isActive = item.classList.contains('active');
        
        document.querySelectorAll('.accordion-item').forEach(item => {
          item.classList.remove('active');
        });
        
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });`
  },
  {
    id: 'tabs',
    name: 'Sekmeler',
    selector: '.tabs',
    position: 'after',
    html: `<div class="tabs">
      <div class="tab-headers">
        <button class="tab-header active">Sekme 1</button>
        <button class="tab-header">Sekme 2</button>
        <button class="tab-header">Sekme 3</button>
      </div>
      <div class="tab-contents">
        <div class="tab-content active">İçerik 1</div>
        <div class="tab-content">İçerik 2</div>
        <div class="tab-content">İçerik 3</div>
      </div>
    </div>`,
    css: `.tabs {
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }
    .tab-headers {
      display: flex;
      background: #f8f9fa;
      border-bottom: 1px solid #ddd;
    }
    .tab-header {
      padding: 10px 20px;
      border: none;
      background: none;
      cursor: pointer;
    }
    .tab-header.active {
      background: white;
      border-bottom: 2px solid #007bff;
    }
    .tab-content {
      display: none;
      padding: 20px;
    }
    .tab-content.active {
      display: block;
    }`,
    javascript: `document.querySelectorAll('.tab-header').forEach((header, index) => {
      header.addEventListener('click', function() {
        document.querySelectorAll('.tab-header').forEach(h => h.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        this.classList.add('active');
        document.querySelectorAll('.tab-content')[index].classList.add('active');
      });
    });`
  },
]; 