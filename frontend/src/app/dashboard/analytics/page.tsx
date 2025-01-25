"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { Pagination } from "@nextui-org/pagination";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { useQuery } from "@tanstack/react-query";
import { analytics } from "@/lib/api";

// Tarih aralığı seçenekleri
const DATE_RANGES = [
  { value: "today", label: "Bugün" },
  { value: "yesterday", label: "Dün" },
  { value: "last7days", label: "Son 7 Gün" },
  { value: "last30days", label: "Son 30 Gün" },
  { value: "thisMonth", label: "Bu Ay" },
  { value: "lastMonth", label: "Geçen Ay" },
  { value: "custom", label: "Özel Aralık" }
];

// Olay türleri
const EVENT_TYPES = [
  { value: "all", label: "Tüm Olaylar" },
  { value: "page_view", label: "Sayfa Görüntüleme" },
  { value: "click", label: "Tıklama" },
  { value: "product_view", label: "Ürün Görüntüleme" },
  { value: "add_to_cart", label: "Sepete Ekleme" },
  { value: "remove_from_cart", label: "Sepetten Çıkarma" },
  { value: "checkout_start", label: "Ödeme Başlatma" },
  { value: "checkout_complete", label: "Ödeme Tamamlama" },
  { value: "login", label: "Giriş" },
  { value: "register", label: "Kayıt" }
];

const AnalyticsDashboard = () => {

  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => analytics.getEvents()
  });

  console.log(data);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Analytics Dashboard</h1>
    </div>
  );
};

export default AnalyticsDashboard; 