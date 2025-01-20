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

// CORS settings
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/components', componentRoutes);

// Widget endpoint
app.get('/widget.js', async (req, res) => {
  try {
    const apiKey = req.query.apiKey;
    if (!apiKey) {
      return res.status(400).send('API key is required');
    }

    const user = await User.findOne({ apiKeys: apiKey });
    if (!user) {
      return res.status(404).send('Invalid API key');
    }

    const components = await Component.find({ userId: user._id, isActive: true });
    
    // Generate widget JavaScript code
    const widgetCode = `
      (function() {
        const components = ${JSON.stringify(components)};
        
        components.forEach(component => {
          const targetElement = document.querySelector(component.selector);
          if (!targetElement) return;
          
          // Create container div
          const container = document.createElement('div');
          container.innerHTML = component.html;
          
          // Add CSS
          if (component.css) {
            const style = document.createElement('style');
            style.textContent = component.css;
            document.head.appendChild(style);
          }
          
          // Add component
          if (component.position === 'before') {
            targetElement.insertBefore(container, targetElement.firstChild);
          } else {
            targetElement.appendChild(container);
          }
          
          // Add JavaScript
          if (component.javascript) {
            try {
              const script = document.createElement('script');
              script.text = component.javascript;
              document.body.appendChild(script);
            } catch (error) {
              console.error('Widget JavaScript error:', error);
            }
          }
        });
      })();
    `;

    res.setHeader('Content-Type', 'application/javascript');
    res.send(widgetCode);
  } catch (error) {
    console.error('Widget loading error:', error);
    res.status(500).send('An error occurred while loading the widget');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 