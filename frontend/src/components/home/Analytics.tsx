'use client';

import { motion } from 'framer-motion';
import { FiPieChart, FiTrendingUp, FiUsers } from 'react-icons/fi';

const analyticsFeatures = [
  {
    icon: <FiPieChart className="w-8 h-8" />,
    title: 'Detaylı Analitikler',
    description: 'Widget kullanım istatistiklerini gerçek zamanlı takip edin'
  },
  {
    icon: <FiTrendingUp className="w-8 h-8" />,
    title: 'Performans Metrikleri',
    description: 'Widgetlarınızın performansını ve etkileşim oranlarını ölçün'
  },
  {
    icon: <FiUsers className="w-8 h-8" />,
    title: 'Kullanıcı Davranışları',
    description: 'Kullanıcılarınızın widgetlarla nasıl etkileşime girdiğini analiz edin'
  }
];

const Analytics = () => {
  return (
    <section id="analytics" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Güçlü Analitik Araçları
          </h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Widget&apos;larınızın performansını ve kullanıcı etkileşimlerini detaylı olarak analiz edin
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {analyticsFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="p-8 rounded-xl bg-gradient-to-br from-content1/50 to-content1/30 backdrop-blur-sm border border-content1"
            >
              <div className="mb-6 text-primary">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-foreground/80">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Analytics; 