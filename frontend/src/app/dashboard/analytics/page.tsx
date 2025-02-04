"use client";

import { useState, useCallback, useMemo, useEffect, ChangeEvent } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Chip } from "@nextui-org/chip";
import { Spinner } from "@nextui-org/spinner";
import { Pagination } from "@nextui-org/pagination";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { useEvents } from "@/hooks/queries";
import { usePageDurationStats, useDetailedPageDuration } from '@/hooks/queries/useAnalytics';
import { Input } from "@nextui-org/input";
import { FiSearch, FiCalendar } from "react-icons/fi";

interface PageDurationStat {
  path: string;
  averageDuration: number;
  visits: number;
  minDuration: number;
  maxDuration: number;
  lastVisit: string;
}

interface DetailedDuration {
  eventData: {
    startTime: string;
    endTime: string;
    duration: number;
  };
}

interface Activity {
  eventName: string;
  sessionId: string;
  userId: string;
  metadata: {
    timestamp: string;
  };
  eventData?: {
    email?: string;
    status?: string;
    products?: Array<{ name: string }>;
    name?: string;
    total?: number;
    currency?: string;
  };
}

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

// Debounce hook'u
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const AnalyticsDashboard = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<string>("today");
  const [selectedEventType, setSelectedEventType] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pathInput, setPathInput] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ startDate?: string; endDate?: string }>({});

  // Debounce'lu path değeri
  const selectedPath = useDebounce(pathInput, 500);

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
    return events.filter((event: Activity) => event.eventName === selectedEventType);
  }, [data, selectedEventType]);

  // Kullanıcı aktivitelerini useMemo ile hesapla
  const userActivities = useMemo(() => 
    filteredEvents.filter((event: Activity) => 
      ["LOGIN", "REGISTER", "IDENTIFY", "FORGOT_PASSWORD"].includes(event.eventName)
    ), 
    [filteredEvents]
  );

  // E-ticaret aktivitelerini useMemo ile hesapla
  const ecommerceActivities = useMemo(() => 
    filteredEvents.filter((event: Activity) => 
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

  const { data: pageDurationStats, isLoading: isLoadingStats } = usePageDurationStats({
    path: selectedPath,
    ...dateRange
  });

  const { data: detailedDuration, isLoading: isLoadingDetails } = useDetailedPageDuration(
    selectedPath,
    50
  );

  const handlePathInputChange = (e: ChangeEvent<HTMLInputElement>) => setPathInput(e.target.value);

  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => 
    setDateRange(prev => ({ ...prev, startDate: e.target.value }));

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => 
    setDateRange(prev => ({ ...prev, endDate: e.target.value }));

  const handlePageChange = (page: number) => setPage(page);

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
    <div className="max-w-7xl mx-auto space-y-8">
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
                        {new Set(filteredEvents.map(e => e.eventData?.userId)).size}
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
                  {userActivities.map((activity: Activity, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{activity.eventName}</TableCell>
                      <TableCell>{activity.eventData?.email || '-'}</TableCell>
                      <TableCell>{new Date(activity.metadata.timestamp).toLocaleString('tr-TR')}</TableCell>
                      <TableCell>{activity.eventData?.status || '-'}</TableCell>
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
                  {ecommerceActivities.map((activity: Activity, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{activity.eventName}</TableCell>
                      <TableCell>
                        {activity.eventData?.products ? 
                          activity.eventData.products.map(p => p.name).join(', ') : 
                          activity.eventData?.name || '-'}
                      </TableCell>
                      <TableCell>
                        {activity.eventData?.total ? 
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
                  {paginatedEvents.map((event: Activity, index: number) => (
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
                  onChange={handlePageChange}
                />
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      {/* Sayfa Süre Analizleri */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Sayfa Süre Analizleri</h2>
        </CardHeader>
        <CardBody>
          {/* Filtreler */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              type="text"
              placeholder="Sayfa yolu filtrele..."
              value={pathInput}
              onChange={handlePathInputChange}
              startContent={<FiSearch className="text-gray-400" />}
            />
            <Input
              type="date"
              value={dateRange.startDate}
              onChange={handleStartDateChange}
              startContent={<FiCalendar className="text-gray-400" />}
              placeholder="Başlangıç tarihi"
            />
            <Input
              type="date"
              value={dateRange.endDate}
              onChange={handleEndDateChange}
              startContent={<FiCalendar className="text-gray-400" />}
              placeholder="Bitiş tarihi"
            />
          </div>

          {/* İstatistikler */}
          {isLoadingStats ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {pageDurationStats?.map((stat: PageDurationStat) => (
                <Card key={stat.path} className="bg-gray-50">
                  <CardBody>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.path}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Ortalama Süre:</span>
                        <span className="text-sm font-medium">
                          {Math.round(stat.averageDuration / 1000)} saniye
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Toplam Ziyaret:</span>
                        <span className="text-sm font-medium">{stat.visits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Min Süre:</span>
                        <span className="text-sm font-medium">
                          {Math.round(stat.minDuration / 1000)} saniye
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Max Süre:</span>
                        <span className="text-sm font-medium">
                          {Math.round(stat.maxDuration / 1000)} saniye
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Son Ziyaret:</span>
                        <span className="text-sm font-medium">
                          {new Date(stat.lastVisit).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

          {/* Detaylı Görüntüleme Geçmişi */}
          {selectedPath && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Detaylı Görüntüleme Geçmişi: {selectedPath}
              </h3>
              
              {isLoadingDetails ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : (
                <Table aria-label="Detaylı görüntüleme geçmişi">
                  <TableHeader>
                    <TableColumn>Başlangıç</TableColumn>
                    <TableColumn>Bitiş</TableColumn>
                    <TableColumn>Süre</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {detailedDuration?.map((detail: DetailedDuration, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(detail.eventData.startTime).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {new Date(detail.eventData.endTime).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {Math.round(detail.eventData.duration / 1000)} saniye
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard; 