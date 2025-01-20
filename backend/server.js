require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const componentRoutes = require('./routes/components');
const User = require('./models/User');
const Component = require('./models/Component');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // IP başına maksimum istek
  message: {
    error: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

// CORS settings
app.use(cors({
  origin: '*',  // Tüm originlere izin ver
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting uygula
app.use('/api/', limiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/components', componentRoutes);

// Widget endpoint with caching
const widgetCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

app.get('/widget.js', async (req, res) => {
  try {
    const apiKey = req.query.apiKey;
    if (!apiKey) {
      return res.status(400).json({
        error: 'API key gerekli',
        code: 'MISSING_API_KEY'
      });
    }

    // Cache'den kontrol et
    const cachedData = widgetCache.get(apiKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      res.setHeader('Content-Type', 'application/javascript');
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5 dakika
      return res.send(cachedData.code);
    }

    const user = await User.findOne({ apiKeys: apiKey });
    if (!user) {
      return res.status(404).json({
        error: 'Geçersiz API key',
        code: 'INVALID_API_KEY'
      });
    }

    const components = await Component.find({ 
      userId: user._id, 
      isActive: true 
    });
    
    // Widget kodunu oluştur
    const widgetCode = `
      (function() {
        const components = ${JSON.stringify(components)};
        
        components.forEach(component => {
          try {
            const targetElement = document.querySelector(component.selector);
            if (!targetElement) return;
            
            // Container oluştur
            const container = document.createElement('div');
            container.setAttribute('data-widget-id', component._id);
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
            
            // JavaScript'i çalıştır
            if (component.javascript) {
              try {
                const script = document.createElement('script');
                script.text = component.javascript;
                document.body.appendChild(script);
              } catch (error) {
                console.error('Widget JavaScript error:', error);
              }
            }
          } catch (error) {
            console.error('Widget loading error:', error);
          }
        });
      })();
    `;

    // Cache'e kaydet
    widgetCache.set(apiKey, {
      code: widgetCode,
      timestamp: Date.now()
    });

    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 dakika
    res.send(widgetCode);
  } catch (error) {
    console.error('Widget loading error:', error);
    res.status(500).json({
      error: 'Widget yüklenirken hata oluştu',
      code: 'WIDGET_ERROR'
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Sunucu hatası oluştu',
    code: 'SERVER_ERROR'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Sayfa bulunamadı',
    code: 'NOT_FOUND'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 