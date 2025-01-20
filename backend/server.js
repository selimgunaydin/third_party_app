require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const componentRoutes = require('./routes/components');
const User = require('./models/User');
const Component = require('./models/Component');

const app = express();

// CORS ayarları
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/components', componentRoutes);

// Widget endpoint'i
app.get('/widget/:apiKey', async (req, res) => {
  try {
    const user = await User.findOne({ apiKey: req.params.apiKey });
    if (!user) {
      return res.status(404).send('Geçersiz API key');
    }

    const components = await Component.find({ userId: user._id, isActive: true });
    
    // Widget JavaScript kodunu oluştur
    const widgetCode = `
      (function() {
        const components = ${JSON.stringify(components)};
        
        components.forEach(component => {
          const targetElement = document.querySelector(component.selector);
          if (!targetElement) return;
          
          // Container div oluştur
          const container = document.createElement('div');
          container.innerHTML = component.html;
          
          // CSS ekle
          if (component.css) {
            const style = document.createElement('style');
            style.textContent = component.css;
            document.head.appendChild(style);
          }
          
          // Component'i ekle
          if (component.position === 'before') {
            targetElement.insertBefore(container, targetElement.firstChild);
          } else {
            targetElement.appendChild(container);
          }
          
          // JavaScript ekle
          if (component.javascript) {
            try {
              const script = document.createElement('script');
              script.text = component.javascript;
              document.body.appendChild(script);
            } catch (error) {
              console.error('Widget JavaScript hatası:', error);
            }
          }
        });
      })();
    `;

    res.setHeader('Content-Type', 'application/javascript');
    res.send(widgetCode);
  } catch (error) {
    console.error('Widget yükleme hatası:', error);
    res.status(500).send('Widget yüklenirken bir hata oluştu');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 