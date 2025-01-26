"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Code } from "@nextui-org/code";
import { Button } from "@nextui-org/button";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

// Sidebar öğeleri
const SIDEBAR_ITEMS = [
  {
    title: "Başlangıç",
    items: [
      { id: "overview", label: "Genel Bakış" },
      { id: "integration", label: "Entegrasyon" },
    ],
  },
  {
    title: "Kullanım Örnekleri",
    items: [
      { id: "user-operations", label: "Kullanıcı İşlemleri" },
      { id: "page-tracking", label: "Sayfa ve Element İzleme" },
      { id: "ecommerce", label: "E-ticaret İşlemleri" },
      { id: "wishlist", label: "İstek Listesi İşlemleri" },
      { id: "gtm", label: "GTM Entegrasyonu" },
    ],
  },
  {
    title: "Güvenlik",
    items: [{ id: "security", label: "Güvenlik ve En İyi Uygulamalar" }],
  },
];

const CodeBlock = ({ children }: { children: string }) => {
  return (
    <Code
      className="p-4 rounded-lg w-full"
      style={{
        whiteSpace: "pre",
        display: "block",
        overflowX: "auto",
        fontSize: "0.9rem",
        lineHeight: "1.5",
        tabSize: 2,
      }}
    >
      {children}
    </Code>
  );
};

const Sidebar = ({
  activeSection,
  onSectionChange,
}: {
  activeSection: string;
  onSectionChange: (id: string) => void;
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          isIconOnly
          variant="light"
          onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background/60 backdrop-blur-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full bg-background z-40 w-64 border-r border-divider transform transition-transform duration-300
        lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }
      `}
      >
        <ScrollShadow className="h-full py-8 px-4">
          <div className="mb-8">
            <h1 className="text-xl font-bold">Analytics API</h1>
            <p className="text-sm text-gray-500 mt-2">Dokümantasyon</p>
          </div>

          <nav className="space-y-8">
            {SIDEBAR_ITEMS.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {group.title}
                </h2>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          onSectionChange(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                          ${
                            activeSection === item.id
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-foreground/70 hover:bg-default-100"
                          }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </ScrollShadow>
      </div>
    </>
  );
};

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          <div className="space-y-8">
            {/* İçerik bölümleri */}
            <div
              id="overview"
              className={activeSection === "overview" ? "block" : "hidden"}
            >
              <Card className="shadow-lg">
                <CardHeader className="border-b border-divider">
                  <h2 className="text-2xl font-semibold">Genel Bakış</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <p className="text-gray-600">
                    Analytics API, web uygulamanızda kullanıcı davranışlarını ve
                    olayları izlemek için kullanılan bir API&apos;dir. Bu API
                    sayesinde sayfa görüntülemeleri, tıklamalar, form
                    gönderimler ve özel olayları takip edebilirsiniz.
                  </p>
                </CardBody>
              </Card>
            </div>

            <div
              id="integration"
              className={activeSection === "integration" ? "block" : "hidden"}
            >
              <Card className="shadow-lg">
                <CardHeader className="border-b border-divider">
                  <h2 className="text-2xl font-semibold">Entegrasyon</h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      1. Script Yükleme
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Analytics script&apos;ini sayfanıza ekleyin. Script&apos;i
                      body tag&apos;inin sonuna eklemek en iyi performansı
                      sağlayacaktır.
                    </p>
                    <CodeBlock>
                      {`<script 
  src="https://api.example.com/api/scripts/widget/script/widget.js?apiKey=YOUR_API_KEY">
</script>`}
                    </CodeBlock>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      2. Analytics Nesnesini Başlatma
                    </h3>
                    <CodeBlock>
                      {`// Analytics widget'ını yükle
const analytics = new ThirdPartyAnalytics();

// Sayfa görüntüleme olayını otomatik kaydet
analytics.pageView();`}
                    </CodeBlock>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      3. Otomatik Olay Takibi
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Script yüklendikten sonra bazı olaylar otomatik olarak
                      takip edilir:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Sayfa görüntülemeleri</li>
                      <li>
                        Tıklama olayları (data-track özelliği olan elementler
                        için)
                      </li>
                      <li>
                        Form gönderim olayları (data-track-form özelliği olan
                        formlar için)
                      </li>
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div
              id="user-operations"
              className={
                activeSection === "user-operations" ? "block" : "hidden"
              }
            >
              <Card className="shadow-lg">
                <CardHeader className="border-b border-divider">
                  <h2 className="text-2xl font-semibold">
                    Kullanıcı İşlemleri
                  </h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Kullanıcı Tanımlama</h4>
                    <CodeBlock>
                      {`// Kullanıcıyı tanımla
analytics.identify('user123', {
  name: 'John Doe',
  email: 'john@example.com',
  registeredAt: '2024-01-01T00:00:00.000Z'
});`}
                    </CodeBlock>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Giriş İşlemi</h4>
                    <CodeBlock>
                      {`analytics.login({
  userId: 'user123',
  email: 'john@example.com',
  method: 'email',
  status: 'success'
});`}
                    </CodeBlock>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Kayıt İşlemi</h4>
                    <CodeBlock>
                      {`analytics.register({
  userId: 'user123',
  email: 'john@example.com',
  method: 'email',
  status: 'success'
});`}
                    </CodeBlock>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div
              id="page-tracking"
              className={activeSection === "page-tracking" ? "block" : "hidden"}
            >
              <Card className="shadow-lg">
                <CardHeader className="border-b border-divider">
                  <h2 className="text-2xl font-semibold">
                    Sayfa ve Element İzleme
                  </h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Sayfa Görüntüleme</h4>
                    <CodeBlock>
                      {`// Otomatik sayfa görüntüleme
analytics.pageView();

// Özel veri ile sayfa görüntüleme
analytics.pageView({
  title: document.title,
  url: window.location.href,
  path: window.location.pathname,
  referrer: document.referrer
});`}
                    </CodeBlock>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Element Tıklama</h4>
                    <CodeBlock>
                      {`// Tek bir elementi izleme
const button = document.querySelector('#myButton');
analytics.trackClick(button);

// Tüm butonları izleme
document.querySelectorAll('button').forEach(button => {
  analytics.trackClick(button);
});`}
                    </CodeBlock>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Form İzleme</h4>
                    <CodeBlock>
                      {`const form = document.getElementById('contactForm');
analytics.trackFormSubmission(form);`}
                    </CodeBlock>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div
              id="ecommerce"
              className={activeSection === "ecommerce" ? "block" : "hidden"}
            >
              <Card className="shadow-lg">
                <CardHeader className="border-b border-divider">
                  <h2 className="text-2xl font-semibold">
                    E-ticaret İşlemleri
                  </h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Ürün Görüntüleme</h4>
                    <CodeBlock>
                      {`analytics.productViewed({
  productId: 'PROD123',
  name: 'Örnek Ürün',
  price: 149.99,
  category: 'Elektronik'
});`}
                    </CodeBlock>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Sepet İşlemleri</h4>
                    <CodeBlock>
                      {`// Sepete Ekleme
analytics.addToCart({
  productId: 'PROD123',
  name: 'Örnek Ürün',
  price: 149.99,
  quantity: 1,
  category: 'Elektronik'
});

// Sepetten Çıkarma
analytics.removeFromCart({
  productId: 'PROD123',
  name: 'Örnek Ürün',
  userId: 'user123'
});`}
                    </CodeBlock>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Ödeme İşlemleri</h4>
                    <CodeBlock>
                      {`// Ödeme Başlatma
analytics.checkoutStarted({
  checkoutId: 'CHK123',
  total: 449.98,
  currency: 'TRY',
  userId: 'user123',
  products: [
    {
      productId: 'PROD1',
      name: 'Ürün 1',
      price: 149.99,
      quantity: 1
    },
    {
      productId: 'PROD2',
      name: 'Ürün 2',
      price: 299.99,
      quantity: 1
    }
  ]
});

// Ödeme Tamamlama
analytics.checkoutCompleted({
  checkoutId: 'CHK123',
  total: 449.98,
  currency: 'TRY',
  paymentMethod: 'credit_card',
  status: 'success',
  userId: 'user123',
  products: [/* ... */]
});

// Ödeme İptali
analytics.checkoutCancelled({
  checkoutId: 'CHK123',
  total: 449.98,
  currency: 'TRY',
  status: 'cancelled',
  userId: 'user123',
  errorMessage: 'Kullanıcı tarafından iptal edildi'
});`}
                    </CodeBlock>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div
              id="wishlist"
              className={activeSection === "wishlist" ? "block" : "hidden"}
            >
              <Card className="shadow-lg">
                <CardHeader className="border-b border-divider">
                  <h2 className="text-2xl font-semibold">
                    İstek Listesi İşlemleri
                  </h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">
                      İstek Listesi Yönetimi
                    </h4>
                    <CodeBlock>
                      {`// İstek Listesine Ekleme
analytics.addWishlist({
  productId: 'PROD123',
  userId: 'user123',
  productName: 'Örnek Ürün',
  price: 149.99,
  category: 'Elektronik'
});

// İstek Listesinden Çıkarma
analytics.removeWishlist({
  productId: 'PROD123',
  userId: 'user123',
  productName: 'Örnek Ürün',
  category: 'Elektronik'
});`}
                    </CodeBlock>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div
              id="gtm"
              className={activeSection === "gtm" ? "block" : "hidden"}
            >
              <Card className="shadow-lg">
                <CardHeader className="border-b border-divider">
                  <h2 className="text-2xl font-semibold">GTM Entegrasyonu</h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">
                      GTM&apos;den Veri Alma
                    </h4>
                    <CodeBlock>
                      {`// GTM'den kullanıcı bilgilerini al
function getGTMUser() {
  const dataLayer = window.dataLayer || [];
  const gtmData = dataLayer.find(data => data.user);
  return gtmData ? gtmData.user : null;
}

// GTM kullanıcısını analytics'e tanımla
const gtmUser = getGTMUser();
if (gtmUser && gtmUser.isAuthenticated) {
  analytics.identify(gtmUser.id, {
    email: gtmUser.email,
    name: gtmUser.name,
    registeredAt: gtmUser.createdAt
  });
}`}
                    </CodeBlock>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div
              id="security"
              className={activeSection === "security" ? "block" : "hidden"}
            >
              <Card className="shadow-lg">
                <CardHeader className="border-b border-divider">
                  <h2 className="text-2xl font-semibold">
                    Güvenlik ve En İyi Uygulamalar
                  </h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Kimlik Doğrulama Kontrolü
                    </h3>
                    <CodeBlock>
                      {`// Kimlik doğrulama gerektiren işlemler için yardımcı fonksiyon
function requireAuth(callback) {
  const user = getUser(); // Kendi auth sisteminizden kullanıcıyı alın
  if (!user || !user.isAuthenticated) {
    alert('Bu işlem için giriş yapmanız gerekmektedir.');
    return false;
  }
  return callback(user);
}

// Kullanımı
function addToCart(productId) {
  requireAuth((user) => {
    analytics.addToCart({
      productId,
      userId: user.id,
      // ... diğer veriler
    });
  });
}`}
                    </CodeBlock>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Öneriler</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>API anahtarınızı güvenli bir şekilde saklayın</li>
                      <li>Hassas kullanıcı verilerini göndermekten kaçının</li>
                      <li>Olay verilerini doğrulayın ve temizleyin</li>
                      <li>Rate limiting ve throttling uygulayın</li>
                      <li>Hata durumlarını düzgün şekilde yönetin</li>
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocsPage;
