import { useCustomerAnalytics } from '@/hooks/queries/useCustomers';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Card,
  Tabs,
  Tab,
  Spinner,
  CardBody,
  CardHeader
} from '@nextui-org/react';
import { formatDate } from '@/lib/utils';

interface CustomerAnalyticsDialogProps {
  customerId: string | null;
  onClose: () => void;
}

export function CustomerAnalyticsDialog({
  customerId,
  onClose,
}: CustomerAnalyticsDialogProps) {
  const { data, isLoading } = useCustomerAnalytics(customerId);

  return (
    <Modal 
      isOpen={!!customerId} 
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>Müşteri Analizi</ModalHeader>
        <ModalBody className="pb-6">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Spinner />
            </div>
          ) : data ? (
            <Tabs aria-label="Müşteri analiz sekmeleri">
              <Tab key="overview" title="Genel Bakış">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Müşteri Bilgileri</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-default-500">Son Ziyaret</p>
                        <p>{formatDate(data.customer.lastVisit)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">Toplam Ziyaret</p>
                        <p>{data.customer.analytics.totalVisits}</p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">Son Konum</p>
                        <p>{data.customer.lastLocation.city || 'Bilinmiyor'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">Son IP</p>
                        <p>{data.customer.lastLocation.ip}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Tab>

              <Tab key="products" title="Ürün İstatistikleri">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">En Çok İncelenen Ürünler</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-2">
                        {data.analytics.mostViewedProducts.map((product) => (
                          <div
                            key={product._id}
                            className="flex items-center justify-between border-b py-2"
                          >
                            <div>
                              <p className="font-medium">{product.productName}</p>
                              <p className="text-sm text-default-500">
                                ₺{product.productPrice}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{product.viewCount} görüntüleme</p>
                              <p className="text-sm text-default-500">
                                Son: {formatDate(product.lastViewed)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">En Çok Sepete Eklenen</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-2">
                        {data.analytics.mostAddedToCart.map((product) => (
                          <div
                            key={product._id}
                            className="flex items-center justify-between border-b py-2"
                          >
                            <div>
                              <p className="font-medium">{product.productName}</p>
                              <p className="text-sm text-default-500">
                                ₺{product.productPrice}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {product.addToCartCount} kez sepete eklendi
                              </p>
                              <p className="text-sm text-default-500">
                                Son: {formatDate(product.lastAdded)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              <Tab key="orders" title="Sipariş İstatistikleri">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Sipariş İstatistikleri</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-default-500">Toplam Sipariş</p>
                        <p className="text-2xl font-semibold">
                          {data.analytics.orderStats.totalOrders}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">Toplam Harcama</p>
                        <p className="text-2xl font-semibold">
                          ₺{data.analytics.orderStats.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">
                          Ortalama Sipariş Tutarı
                        </p>
                        <p className="text-2xl font-semibold">
                          ₺{data.analytics.orderStats.averageOrderAmount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">
                          En Yüksek Sipariş Tutarı
                        </p>
                        <p className="text-2xl font-semibold">
                          ₺{data.analytics.orderStats.maxOrderAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          ) : null}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
} 