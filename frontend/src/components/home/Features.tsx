'use client';

import { motion } from 'framer-motion';
import { FiBox, FiCode, FiSettings } from 'react-icons/fi';

const features = [
  {
    icon: <FiBox className="w-6 h-6" />,
    title: 'Hazır Widgetlar',
    description: 'Önceden hazırlanmış widgetları hemen kullanmaya başlayın'
  },
  {
    icon: <FiCode className="w-6 h-6" />,
    title: 'Özelleştirilebilir Kod',
    description: 'Widgetlarınızı ihtiyaçlarınıza göre özelleştirin'
  },
  {
    icon: <FiSettings className="w-6 h-6" />,
    title: 'Kolay Entegrasyon',
    description: 'Tek tıkla sitenize entegre edin'
  }
];

const Features = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="p-6 rounded-xl backdrop-blur-sm border border-gray-200"
          >
            <div className="mb-4 text-primary">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-foreground/80">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Features; 