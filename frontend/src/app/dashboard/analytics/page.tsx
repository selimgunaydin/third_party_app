"use client";

import { useState, useCallback, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Chip } from "@nextui-org/chip";
import { Spinner } from "@nextui-org/spinner";
import { Pagination } from "@nextui-org/pagination";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { useEvents } from "@/hooks/queries";


// Tarih aralığı seçenekleri
const DATE_RANGES = [
  { value: "today", label: "Bugün" },
  { value: "yesterday", label: "Dün" },
  { value: "last7days", label: "Son 7 Gün" },
  { value: "last30days", label: "Son 30 Gün" },
  { value: "thisMonth", label: "Bu Ay" },
  { value: "lastMonth", label: "Geçen Ay" }
] as const;

// Olay türleri
const EVENT_TYPES = [
  { value: "all", label: "Tüm Olaylar" },
  { value: "PAGE_VIEW", label: "Sayfa Görüntüleme" },
  { value: "ELEMENT_CLICK", label: "Tıklama" },
  { value: "PRODUCT_VIEWED", label: "Ürün Görüntüleme" },
  { value: "ADD_TO_CART", label: "Sepete Ekleme" },
  { value: "REMOVE_FROM_CART", label: "Sepetten Çıkarma" },
  { value: "CHECKOUT_STARTED", label: "Ödeme Başlatma" },
  { value: "CHECKOUT_COMPLETED", label: "Ödeme Tamamlama" },
  { value: "CHECKOUT_CANCELLED", label: "Ödeme İptal" },
  { value: "FORM_SUBMISSION", label: "Form Gönderimi" },
  { value: "LOGIN", label: "Giriş" },
  { value: "REGISTER", label: "Kayıt" },
  { value: "ADD_WISHLIST", label: "Favorilere Ekleme" },
  { value: "REMOVE_WISHLIST", label: "Favorilerden Çıkarma" },
  { value: "FORGOT_PASSWORD", label: "Şifremi Unuttum" }
] as const;

const getDateRange = (range: string): { startDate: string; endDate: string } => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let startDate: Date;
  let endDate: Date = new Date(now.getTime());

  switch (range) {
    case "today":
      startDate = today;
      break;
    case "yesterday":
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 1);
      endDate = new Date(today);
      break;
    case "last7days":
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "last30days":
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 30);
      break;
    case "thisMonth":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "lastMonth":
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    default:
      startDate = today;
  }

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  };
};

const AnalyticsDashboard = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<string>("today");
  const [selectedEventType, setSelectedEventType] = useState<string>("all");
  const [page, setPage] = useState(1);

  // Tarih aralığını useMemo ile hesapla
  const { startDate, endDate } = useMemo(() => 
    getDateRange(selectedDateRange), 
    [selectedDateRange]
  );

  // Tarih değiştiğinde çağrılacak fonksiyon
  const handleDateRangeChange = useCallback((range: string) => {
    setSelectedDateRange(range);
    setPage(1);
  }, []);

  // Olay türü değiştiğinde çağrılacak fonksiyon
  const handleEventTypeChange = useCallback((type: string) => {
    setSelectedEventType(type);
    setPage(1);
  }, []);

  const { data, isLoading, error } = useEvents({ startDate, endDate });

  // Filtrelenmiş verileri useMemo ile hesapla
  const filteredEvents = useMemo(() => {
    const events = data || [];
    if (selectedEventType === "all") return events;
    return events.filter(event => event.eventName === selectedEventType);
  }, [data, selectedEventType]);

  // Kullanıcı aktivitelerini useMemo ile hesapla
  const userActivities = useMemo(() => 
    filteredEvents.filter(event => 
      ["LOGIN", "REGISTER", "IDENTIFY", "FORGOT_PASSWORD"].includes(event.eventName)
    ), 
    [filteredEvents]
  );

  // E-ticaret aktivitelerini useMemo ile hesapla
  const ecommerceActivities = useMemo(() => 
    filteredEvents.filter(event => 
      ["ADD_TO_CART", "REMOVE_FROM_CART", "CHECKOUT_STARTED", "CHECKOUT_COMPLETED", "CHECKOUT_CANCELLED"].includes(event.eventName)
    ),
    [filteredEvents]
  );

  // Sayfalanmış verileri useMemo ile hesapla
  const paginatedEvents = useMemo(() => {
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEvents.slice(startIndex, endIndex);
  }, [filteredEvents, page]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto my-8 max-w-4xl">
        <CardBody>
          <div className="text-danger">Hata: {(error as Error).message}</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col gap-4 w-full">
            <div>
              <h3 className="text-lg font-medium mb-2">Tarih Aralığı</h3>
              <div className="flex flex-wrap gap-2">
                {DATE_RANGES.map((range) => (
                  <Chip
                    key={range.value}
                    variant={selectedDateRange === range.value ? "solid" : "flat"}
                    color={selectedDateRange === range.value ? "primary" : "default"}
                    className="cursor-pointer"
                    onClick={() => handleDateRangeChange(range.value)}
                  >
                    {range.label}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Olay Türü</h3>
              <div className="flex flex-wrap gap-2">
                {EVENT_TYPES.map((type) => (
                  <Chip
                    key={type.value}
                    variant={selectedEventType === type.value ? "solid" : "flat"}
                    color={selectedEventType === type.value ? "primary" : "default"}
                    className="cursor-pointer"
                    onClick={() => handleEventTypeChange(type.value)}
                  >
                    {type.label}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs aria-label="Analytics tabs">
        <Tab key="overview" title="Genel Bakış">
          <Card>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardBody>
                    <div className="text-center">
                      <div className="text-xl font-bold">{filteredEvents.length}</div>
                      <div className="text-sm text-gray-500">Toplam Olay</div>
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <div className="text-center">
                      <div className="text-xl font-bold">
                        {new Set(filteredEvents.map(e => e.sessionId)).size}
                      </div>
                      <div className="text-sm text-gray-500">Tekil Oturum</div>
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <div className="text-center">
                      <div className="text-xl font-bold">
                        {new Set(filteredEvents.map(e => e.userId)).size}
                      </div>
                      <div className="text-sm text-gray-500">Tekil Kullanıcı</div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="user-activities" title="Kullanıcı Aktiviteleri">
          <Card>
            <CardBody>
              <Table aria-label="Kullanıcı aktiviteleri">
                <TableHeader>
                  <TableColumn>Olay</TableColumn>
                  <TableColumn>Kullanıcı</TableColumn>
                  <TableColumn>Tarih</TableColumn>
                  <TableColumn>Durum</TableColumn>
                </TableHeader>
                <TableBody>
                  {userActivities.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>{activity.eventName}</TableCell>
                      <TableCell>{activity.eventData.email || '-'}</TableCell>
                      <TableCell>{new Date(activity.metadata.timestamp).toLocaleString('tr-TR')}</TableCell>
                      <TableCell>{activity.eventData.status || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="ecommerce" title="E-ticaret">
          <Card>
            <CardBody>
              <Table aria-label="E-ticaret aktiviteleri">
                <TableHeader>
                  <TableColumn>Olay</TableColumn>
                  <TableColumn>Ürün</TableColumn>
                  <TableColumn>Tutar</TableColumn>
                  <TableColumn>Tarih</TableColumn>
                </TableHeader>
                <TableBody>
                  {ecommerceActivities.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>{activity.eventName}</TableCell>
                      <TableCell>
                        {activity.eventData.products ? 
                          activity.eventData.products.map(p => p.name).join(', ') : 
                          activity.eventData.name || '-'}
                      </TableCell>
                      <TableCell>
                        {activity.eventData.total ? 
                          `${activity.eventData.total} ${activity.eventData.currency}` : '-'}
                      </TableCell>
                      <TableCell>{new Date(activity.metadata.timestamp).toLocaleString('tr-TR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="raw" title="Ham Veriler">
          <Card>
            <CardBody>
              <Table aria-label="Ham veriler">
                <TableHeader>
                  <TableColumn>Olay</TableColumn>
                  <TableColumn>Oturum ID</TableColumn>
                  <TableColumn>Kullanıcı ID</TableColumn>
                  <TableColumn>Tarih</TableColumn>
                </TableHeader>
                <TableBody>
                  {paginatedEvents.map((event, index) => (
                    <TableRow key={index}>
                      <TableCell>{event.eventName}</TableCell>
                      <TableCell>{event.sessionId}</TableCell>
                      <TableCell>{event.userId}</TableCell>
                      <TableCell>{new Date(event.metadata.timestamp).toLocaleString('tr-TR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-center mt-4">
                <Pagination
                  total={Math.ceil(filteredEvents.length / 10)}
                  page={page}
                  onChange={setPage}
                />
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard; 