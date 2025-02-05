"use client";

import { useState, useCallback, useMemo, ChangeEvent } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Spinner } from "@nextui-org/spinner";
import { Pagination } from "@nextui-org/pagination";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Input } from "@nextui-org/input";
import { FiSearch, FiCalendar } from "react-icons/fi";
import { formatPrice } from '@/lib/utils';
import { useDebounce } from '@/hooks';
import { useEvents, useMostViewedProducts, useMostAddedProducts, useOrderStatistics, useTimeBasedAnalytics, usePageDurationStats, useDetailedPageDuration, useMostSearchedProducts } from '@/hooks/queries/useAnalytics';
import { formatDateTime, formatDuration } from '@/utils/analytics';
import type { Activity, DetailedDuration, PageDurationStat, TimeBasedEvent, TimeBasedAnalytics } from '@/types/analytics';
import { Chip } from "@nextui-org/chip";

interface TimeBasedStat {
  _id: string;
  events: Array<{
    eventName: string;
    count: number;
  }>;
  totalEvents: number;
}

const ITEMS_PER_PAGE = 10;

interface EventData {
  email?: string;
  status?: string;
  method?: string;
  errorMessage?: string;
  products?: Array<{
    name: string;
    quantity?: number;
  }>;
  name?: string;
  total?: number;
  currency?: string;
}

interface ActivityType {
  eventName: string;
  eventData: EventData;
  metadata: {
    timestamp: string;
  };
  sessionId: string;
  userId: string;
}

interface SearchProduct {
  _id: string;
  count: number;
  productName: string;
}

const AnalyticsDashboard = () => {
  // Pagination states
  const [page, setPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [ecommercePage, setEcommercePage] = useState(1);
  const [timePage, setTimePage] = useState(1);

  // Filter states
  const [pathInput, setPathInput] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ startDate?: string; endDate?: string }>({});
  const [userFilter, setUserFilter] = useState<string>('');
  const [productFilter, setProductFilter] = useState<string>('');
  const [eventFilter, setEventFilter] = useState<string>('');

  // Debounced values
  const selectedPath = useDebounce(pathInput, 500);
  const debouncedUserFilter = useDebounce(userFilter, 500);
  const debouncedProductFilter = useDebounce(productFilter, 500);
  const debouncedEventFilter = useDebounce(eventFilter, 500);

  // Event handlers
  const handlePageChange = useCallback((page: number) => setPage(page), []);
  const handleUserPageChange = useCallback((page: number) => setUserPage(page), []);
  const handleEcommercePageChange = useCallback((page: number) => setEcommercePage(page), []);
  const handleTimePageChange = useCallback((page: number) => setTimePage(page), []);

  const handlePathInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => 
    setPathInput(e.target.value), 
    []
  );

  const handleStartDateChange = useCallback((e: ChangeEvent<HTMLInputElement>) => 
    setDateRange(prev => ({ ...prev, startDate: e.target.value })), 
    []
  );

  const handleEndDateChange = useCallback((e: ChangeEvent<HTMLInputElement>) => 
    setDateRange(prev => ({ ...prev, endDate: e.target.value })), 
    []
  );

  // Data fetching
  const { data: eventsData, isLoading, error } = useEvents();
  const { data: mostViewedProducts } = useMostViewedProducts();
  const { data: mostAddedProducts } = useMostAddedProducts();
  const { data: orderStatistics } = useOrderStatistics();
  const { data: timeBasedAnalytics } = useTimeBasedAnalytics();
  const { data: pageDurationStats, isLoading: isLoadingStats } = usePageDurationStats({
    path: selectedPath,
    ...dateRange
  });
  const { data: detailedDuration, isLoading: isLoadingDetails } = useDetailedPageDuration(
    selectedPath,
    50
  );
  const { data: mostSearchedProducts } = useMostSearchedProducts(undefined, 10);

  const userActivities = useMemo(() => 
    eventsData?.filter((event: Activity) => 
      ["LOGIN", "REGISTER", "IDENTIFY", "FORGOT_PASSWORD"].includes(event.eventName)
    ), 
    [eventsData]
  );

  const ecommerceActivities = useMemo(() => 
    eventsData?.filter((event: Activity) => 
      ["ADD_TO_CART", "REMOVE_FROM_CART", "CHECKOUT_STARTED", "CHECKOUT_COMPLETED", "CHECKOUT_CANCELLED"].includes(event.eventName)
    ),
    [eventsData]
  );

  // Filtered and paginated data
  const paginatedEvents = useMemo(() => {
    const filteredEvents = eventsData?.filter(event => 
      !debouncedEventFilter || 
      event.eventName.toLowerCase().includes(debouncedEventFilter.toLowerCase())
    ) || [];
    
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredEvents.slice(startIndex, endIndex);
  }, [eventsData, page, debouncedEventFilter]);

  const paginatedUserActivities = useMemo(() => {
    const filtered = userActivities?.filter(activity => 
      !debouncedUserFilter || 
      activity.eventData?.email?.toLowerCase().includes(debouncedUserFilter.toLowerCase())
    ) || [];
    
    const startIndex = (userPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filtered.slice(startIndex, endIndex);
  }, [userActivities, userPage, debouncedUserFilter]);

  const paginatedEcommerceActivities = useMemo(() => {
    const filtered = ecommerceActivities?.filter(activity => 
      !debouncedProductFilter || 
      activity.eventData?.products?.some(p => 
        p.name.toLowerCase().includes(debouncedProductFilter.toLowerCase())
      ) ||
      activity.eventData?.name?.toLowerCase().includes(debouncedProductFilter.toLowerCase())
    ) || [];
    
    const startIndex = (ecommercePage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filtered.slice(startIndex, endIndex);
  }, [ecommerceActivities, ecommercePage, debouncedProductFilter]);

  const paginatedTimeBasedAnalytics = useMemo(() => {
    const startIndex = (timePage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return timeBasedAnalytics?.slice(startIndex, endIndex);
  }, [timeBasedAnalytics, timePage]);

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

      <Tabs aria-label="Analytics tabs">
        <Tab key="overview" title="Genel Bakış">
          <Card>
            <CardBody>
            <div className="">
                <h3 className="text-lg font-semibold mb-4">Sipariş İstatistikleri</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Card className="bg-primary-50">
                    <CardBody>
                      <div className="text-sm text-gray-600">Toplam Sipariş</div>
                      <div className="text-xl font-bold">{orderStatistics?.totalOrders || 0}</div>
                    </CardBody>
                  </Card>
                  <Card className="bg-primary-50">
                    <CardBody>
                      <div className="text-sm text-gray-600">Toplam Tutar</div>
                      <div className="text-xl font-bold">{formatPrice(orderStatistics?.totalAmount || 0)}</div>
                    </CardBody>
                  </Card>
                  <Card className="bg-primary-50">
                    <CardBody>
                      <div className="text-sm text-gray-600">Ortalama Sipariş</div>
                      <div className="text-xl font-bold">{formatPrice(orderStatistics?.averageOrderAmount || 0)}</div>
                    </CardBody>
                  </Card>
                  <Card className="bg-primary-50">
                    <CardBody>
                      <div className="text-sm text-gray-600">Min Sipariş</div>
                      <div className="text-xl font-bold">{formatPrice(orderStatistics?.minOrderAmount || 0)}</div>
                    </CardBody>
                  </Card>
                  <Card className="bg-primary-50">
                    <CardBody>
                      <div className="text-sm text-gray-600">Max Sipariş</div>
                      <div className="text-xl font-bold">{formatPrice(orderStatistics?.maxOrderAmount || 0)}</div>
                    </CardBody>
                  </Card>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {/* En Çok Görüntülenen Ürünler */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">En Çok Görüntülenen Ürünler</h3>
                  <Table aria-label="En çok görüntülenen ürünler">
                    <TableHeader>
                      <TableColumn>ÜRÜN ADI</TableColumn>
                      <TableColumn>GÖRÜNTÜLENME</TableColumn>
                      <TableColumn>FİYAT</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {mostViewedProducts?.slice(0, 5).map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>{product.productName}</TableCell>
                          <TableCell>{product.viewCount}</TableCell>
                          <TableCell>{formatPrice(product.productPrice)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* En Çok Sepete Eklenen Ürünler */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">En Çok Sepete Eklenen Ürünler</h3>
                  <Table aria-label="En çok sepete eklenen ürünler">
                    <TableHeader>
                      <TableColumn>ÜRÜN ADI</TableColumn>
                      <TableColumn>EKLENME</TableColumn>
                      <TableColumn>FİYAT</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {mostAddedProducts?.slice(0, 5).map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>{product.productName}</TableCell>
                          <TableCell>{product.addToCartCount}</TableCell>
                          <TableCell>{formatPrice(product.productPrice)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Sipariş İstatistikleri */}

            </CardBody>
          </Card>
        </Tab>

        <Tab key="user-activities" title="Kullanıcı Aktiviteleri">
          <Card>
            <CardBody>
              <div className="space-y-6">
                {/* Filtreleme Seçenekleri */}
                <div className="flex gap-4">
                  <Input
                    type="text"
                    label="Kullanıcı Ara"
                    placeholder="E-posta ile ara..."
                    startContent={<FiSearch className="text-gray-400" />}
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                  />
                  <Input
                    type="date"
                    label="Başlangıç"
                    value={dateRange.startDate}
                    onChange={handleStartDateChange}
                    startContent={<FiCalendar className="text-gray-400" />}
                  />
                  <Input
                    type="date"
                    label="Bitiş"
                    value={dateRange.endDate}
                    onChange={handleEndDateChange}
                    startContent={<FiCalendar className="text-gray-400" />}
                  />
                </div>

                {/* Aktivite İstatistikleri */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-primary-50">
                    <CardBody>
                      <div className="text-sm text-gray-600">Toplam Giriş</div>
                      <div className="text-xl font-bold">
                        {userActivities.filter((a: Activity) => a.eventName === 'LOGIN').length}
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="bg-primary-50">
                    <CardBody>
                      <div className="text-sm text-gray-600">Toplam Kayıt</div>
                      <div className="text-xl font-bold">
                        {userActivities.filter((a: Activity) => a.eventName === 'REGISTER').length}
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="bg-primary-50">
                    <CardBody>
                      <div className="text-sm text-gray-600">Şifre Sıfırlama</div>
                      <div className="text-xl font-bold">
                        {userActivities.filter((a: Activity) => a.eventName === 'FORGOT_PASSWORD').length}
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="bg-primary-50">
                    <CardBody>
                      <div className="text-sm text-gray-600">Tanımlanan Kullanıcılar</div>
                      <div className="text-xl font-bold">
                        {userActivities.filter((a: Activity) => a.eventName === 'IDENTIFY').length}
                      </div>
                    </CardBody>
                  </Card>
                </div>

                {/* Aktivite Tablosu */}
                <Table aria-label="Kullanıcı aktiviteleri">
                  <TableHeader>
                    <TableColumn>Olay</TableColumn>
                    <TableColumn>Kullanıcı</TableColumn>
                    <TableColumn>Tarih</TableColumn>
                    <TableColumn>Durum</TableColumn>
                    <TableColumn>Detaylar</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {paginatedUserActivities.map((activity: ActivityType, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{activity.eventName}</TableCell>
                        <TableCell>{activity.eventData?.email || '-'}</TableCell>
                        <TableCell>{formatDateTime(activity.metadata.timestamp)}</TableCell>
                        <TableCell>
                          <Chip
                            color={activity.eventData?.status === 'success' ? 'success' : 
                                  activity.eventData?.status === 'error' ? 'danger' : 'default'}
                            size="sm"
                          >
                            {activity.eventData?.status || 'beklemede'}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          {activity.eventData?.method && (
                            <Chip size="sm" variant="flat">
                              {activity.eventData.method}
                            </Chip>
                          )}
                          {activity.eventData?.errorMessage && (
                            <div className="text-sm text-danger mt-1">
                              {activity.eventData.errorMessage}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Sayfalama */}
                <div className="flex justify-center mt-4">
                  <Pagination
                    total={Math.ceil((userActivities?.length || 0) / ITEMS_PER_PAGE)}
                    page={userPage}
                    onChange={handleUserPageChange}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="most-searched-products" title="En Çok Aranan Sorgular">
          <Card>
            <CardBody>
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">En Çok Aranan Sorgular</h3>
                <Table aria-label="En çok aranan sorgular">
                  <TableHeader>
                    <TableColumn>Sorgu</TableColumn>
                    <TableColumn>Arama Sayısı</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {mostSearchedProducts?.map((product: SearchProduct) => (
                      <TableRow key={product._id}>
                        <TableCell>{product.productName || product._id}</TableCell>
                        <TableCell>{product.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="ecommerce" title="E-ticaret">
          <Card>
            <CardBody>
              <div className="space-y-6">
                {/* Filtreleme Seçenekleri */}
                <div className="flex gap-4">
                  <Input
                    type="text"
                    label="Ürün Ara"
                    placeholder="Ürün adı ile ara..."
                    startContent={<FiSearch className="text-gray-400" />}
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                  />
                  <Input
                    type="date"
                    label="Başlangıç"
                    value={dateRange.startDate}
                    onChange={handleStartDateChange}
                    startContent={<FiCalendar className="text-gray-400" />}
                  />
                  <Input
                    type="date"
                    label="Bitiş"
                    value={dateRange.endDate}
                    onChange={handleEndDateChange}
                    startContent={<FiCalendar className="text-gray-400" />}
                  />
                </div>

                {/* E-ticaret İstatistikleri */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-primary-50">
                    <CardBody>
                      <div className="text-sm text-gray-600">Sepete Ekleme</div>
                      <div className="text-xl font-bold">
                        {ecommerceActivities.filter((a: Activity) => a.eventName === 'ADD_TO_CART').length}
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="bg-primary-50">
                    <CardBody>
                      <div className="text-sm text-gray-600">Sepetten Çıkarma</div>
                      <div className="text-xl font-bold">
                        {ecommerceActivities.filter((a: Activity) => a.eventName === 'REMOVE_FROM_CART').length}
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="bg-primary-50">
                    <CardBody>
                      <div className="text-sm text-gray-600">Başlanan Ödemeler</div>
                      <div className="text-xl font-bold">
                        {ecommerceActivities.filter((a: Activity) => a.eventName === 'CHECKOUT_STARTED').length}
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="bg-primary-50">
                    <CardBody>
                      <div className="text-sm text-gray-600">Tamamlanan Ödemeler</div>
                      <div className="text-xl font-bold">
                        {ecommerceActivities.filter((a: Activity) => a.eventName === 'CHECKOUT_COMPLETED').length}
                      </div>
                    </CardBody>
                  </Card>
                </div>

                {/* E-ticaret Aktivite Tablosu */}
                <Table aria-label="E-ticaret aktiviteleri">
                  <TableHeader>
                    <TableColumn>Olay</TableColumn>
                    <TableColumn>Ürün(ler)</TableColumn>
                    <TableColumn>Tutar</TableColumn>
                    <TableColumn>Tarih</TableColumn>
                    <TableColumn>Durum</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {paginatedEcommerceActivities.map((activity: ActivityType, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip
                            color={
                              activity.eventName === 'CHECKOUT_COMPLETED' ? 'success' :
                              activity.eventName === 'CHECKOUT_CANCELLED' ? 'danger' :
                              activity.eventName === 'CHECKOUT_STARTED' ? 'warning' :
                              'default'
                            }
                            size="sm"
                          >
                            {activity.eventName}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          {activity.eventData?.products ? (
                            <div className="space-y-1">
                              {activity.eventData.products.map((p: any, i: number) => (
                                <div key={i} className="text-sm">
                                  {p.name} {p.quantity && `(${p.quantity}x)`}
                                </div>
                              ))}
                            </div>
                          ) : (
                            activity.eventData?.name || '-'
                          )}
                        </TableCell>
                        <TableCell>
                          {activity.eventData?.total ? 
                            formatPrice(activity.eventData.total) : '-'}
                        </TableCell>
                        <TableCell>{formatDateTime(activity.metadata.timestamp)}</TableCell>
                        <TableCell>
                          {activity.eventData?.status && (
                            <Chip
                              color={activity.eventData.status === 'success' ? 'success' : 'danger'}
                              size="sm"
                            >
                              {activity.eventData.status}
                            </Chip>
                          )}
                          {activity.eventData?.errorMessage && (
                            <div className="text-sm text-danger mt-1">
                              {activity.eventData.errorMessage}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Sayfalama */}
                <div className="flex justify-center mt-4">
                  <Pagination
                    total={Math.ceil((ecommerceActivities?.length || 0) / ITEMS_PER_PAGE)}
                    page={ecommercePage}
                    onChange={handleEcommercePageChange}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="page-analytics" title="Sayfa Analizleri">
          <Card>
            <CardBody>
              {/* Sayfa Analiz Filtreleri */}
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

              {/* Sayfa İstatistikleri */}
              {isLoadingStats ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pageDurationStats?.map((stat: PageDurationStat) => (
                    <Card key={stat.path} className="bg-gray-50">
                      <CardBody>
                        <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.path}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Ortalama Süre:</span>
                            <span className="text-sm font-medium">
                              {formatDuration(stat.averageDuration)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Toplam Ziyaret:</span>
                            <span className="text-sm font-medium">{stat.visits}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Min Süre:</span>
                            <span className="text-sm font-medium">
                              {formatDuration(stat.minDuration)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Max Süre:</span>
                            <span className="text-sm font-medium">
                              {formatDuration(stat.maxDuration)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Son Ziyaret:</span>
                            <span className="text-sm font-medium">
                              {formatDateTime(stat.lastVisit)}
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}

              {/* Detaylı Sayfa Görüntüleme */}
              {selectedPath && (
                <div className="mt-8">
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
                              {formatDateTime(detail.eventData.startTime)}
                            </TableCell>
                            <TableCell>
                              {formatDateTime(detail.eventData.endTime)}
                            </TableCell>
                            <TableCell>
                              {formatDuration(detail.eventData.duration)}
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
        </Tab>

        <Tab key="time-based" title="Zaman Bazlı">
          <Card>
            <CardBody>
              <div className="space-y-6">
                {/* Filtreleme */}
                <div className="flex gap-4">
                  <Input
                    type="date"
                    label="Başlangıç Tarihi"
                    value={dateRange.startDate}
                    onChange={handleStartDateChange}
                    startContent={<FiCalendar className="text-gray-400" />}
                  />
                  <Input
                    type="date"
                    label="Bitiş Tarihi"
                    value={dateRange.endDate}
                    onChange={handleEndDateChange}
                    startContent={<FiCalendar className="text-gray-400" />}
                  />
                </div>

                {/* İstatistikler */}
                {timeBasedAnalytics && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedTimeBasedAnalytics?.map((dayStats: TimeBasedAnalytics) => (
                      <Card key={dayStats._id} className="bg-gray-50">
                        <CardBody>
                          <h3 className="text-sm font-medium text-gray-600 mb-2">{dayStats._id}</h3>
                          <div className="space-y-2">
                            {dayStats.events.map((event) => (
                              <div key={event.eventName} className="flex justify-between">
                                <span className="text-sm text-gray-500">{event.eventName}</span>
                                <span className="text-sm font-medium">{event.count}</span>
                              </div>
                            ))}
                            <div className="pt-2 border-t">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-600">Toplam Olay</span>
                                <span className="text-sm font-medium">{dayStats.totalEvents}</span>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Sayfalama */}
                <div className="flex justify-center mt-4">
                  <Pagination
                    total={Math.ceil((timeBasedAnalytics?.length || 0) / ITEMS_PER_PAGE)}
                    page={timePage}
                    onChange={handleTimePageChange}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="raw" title="Ham Veriler">
          <Card>
            <CardBody>
              <div className="space-y-6">
                {/* Filtreleme */}
                <div className="flex gap-4">
                  <Input
                    type="text"
                    label="Olay Ara"
                    placeholder="Olay adı ile ara..."
                    startContent={<FiSearch className="text-gray-400" />}
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                  />
                  <Input
                    type="date"
                    label="Başlangıç"
                    value={dateRange.startDate}
                    onChange={handleStartDateChange}
                    startContent={<FiCalendar className="text-gray-400" />}
                  />
                  <Input
                    type="date"
                    label="Bitiş"
                    value={dateRange.endDate}
                    onChange={handleEndDateChange}
                    startContent={<FiCalendar className="text-gray-400" />}
                  />
                </div>

                {/* Tablo */}
                <Table aria-label="Ham veriler">
                  <TableHeader>
                    <TableColumn>Olay</TableColumn>
                    <TableColumn>Oturum ID</TableColumn>
                    <TableColumn>Kullanıcı ID</TableColumn>
                    <TableColumn>Tarih</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {paginatedEvents.map((event: ActivityType, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{event.eventName}</TableCell>
                        <TableCell>{event.sessionId}</TableCell>
                        <TableCell>{event.userId}</TableCell>
                        <TableCell>{formatDateTime(event.metadata.timestamp)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Sayfalama */}
                <div className="flex justify-center mt-4">
                  <Pagination
                    total={Math.ceil((eventsData?.length || 0) / ITEMS_PER_PAGE)}
                    page={page}
                    onChange={handlePageChange}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard; 