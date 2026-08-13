export interface SupplierInventoryItem {
  id: string;
  supplierId: number;
  itemName: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unit: string;
  unitPrice: number;
  taxType?: string;
  taxRate?: number;
  imageDataUrl?: string;
  updatedAt: string;
}

const STORAGE_PREFIX = "erp_supplier_inventory_v1";
const SAMPLE_CATALOGUE_VERSION = "5";

type InventoryCatalogItem = Omit<SupplierInventoryItem, "id" | "supplierId" | "updatedAt">;

const INVENTORY_IMAGE_URLS: Record<string, string> = {
  "Laptop": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=160&h=160&q=80",
  "24-inch Business Monitor": "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=160&h=160&q=80",
  "Wireless Keyboard and Mouse Set": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=160&h=160&q=80",
  "USB-C Docking Station": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=160&h=160&q=80",
  "Noise-cancelling Headset": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=160&h=160&q=80",
  "Laser Printer": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=160&h=160&q=80",
  "Toner Cartridge": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=160&h=160&q=80&sat=-100",
  "A4 Copy Paper": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&h=160&q=80",
  "Network Switch 24-Port": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=160&h=160&q=80",
  "External SSD 1TB": "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&w=160&h=160&q=80",
  "Ergonomic Office Chair": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=160&h=160&q=80",
  "Height-adjustable Desk": "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=160&h=160&q=80",
  "Filing Cabinet": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=160&h=160&q=80",
  "Whiteboard 120 x 90 cm": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=160&h=160&q=80",
  "Hand Sanitizer 500 ml": "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=160&h=160&q=80",
  "Multi-purpose Cleaner": "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=160&h=160&q=80",
  "Microfiber Cleaning Cloth": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=160&h=160&q=80",
  "First Aid Kit": "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=160&h=160&q=80",
  "Fire Extinguisher 4 kg": "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=160&h=160&q=80",
  "Safety Signage Set": "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&w=160&h=160&q=80",
  "Cardboard Shipping Box": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=160&h=160&q=80",
  "Bubble Wrap Roll": "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=160&h=160&q=80",
  "Packing Tape": "https://images.unsplash.com/photo-1586864387789-628af9feed72?auto=format&fit=crop&w=160&h=160&q=80",
  "Bottled Drinking Water": "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=160&h=160&q=80",
  "Coffee Beans 1 kg": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=160&h=160&q=80",
  "LED Ceiling Light": "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=160&h=160&q=80",
  "Air Conditioner Filter": "https://images.unsplash.com/photo-1631545806609-5f235d7a05d0?auto=format&fit=crop&w=160&h=160&q=80",
  "Workplace Safety Handbook": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=160&h=160&q=80",
  "Product Brochure": "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=160&h=160&q=80",
  "Printer Maintenance Service": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=160&h=160&q=80",
};

// Expand the original one-item demonstration inventory into a useful supplier catalogue.
const SAMPLE_CATALOGUE: InventoryCatalogItem[] = [
  { itemName: "Laptop", category: "IT Equipment", quantity: 10, reorderLevel: 3, unit: "pcs", unitPrice: 8399, taxType: "TAX", taxRate: 10 },
  { itemName: "24-inch Business Monitor", category: "IT Equipment", quantity: 28, reorderLevel: 8, unit: "pcs", unitPrice: 890 },
  { itemName: "Wireless Keyboard and Mouse Set", category: "IT Equipment", quantity: 45, reorderLevel: 12, unit: "sets", unitPrice: 155 },
  { itemName: "USB-C Docking Station", category: "IT Equipment", quantity: 16, reorderLevel: 6, unit: "pcs", unitPrice: 520 },
  { itemName: "Noise-cancelling Headset", category: "IT Equipment", quantity: 24, reorderLevel: 8, unit: "pcs", unitPrice: 285 },
  { itemName: "Laser Printer", category: "Operational Equipment", quantity: 6, reorderLevel: 2, unit: "pcs", unitPrice: 1290 },
  { itemName: "Toner Cartridge", category: "Office Supplies / Stationery", quantity: 9, reorderLevel: 10, unit: "pcs", unitPrice: 245 },
  { itemName: "A4 Copy Paper", category: "Office Supplies / Stationery", quantity: 120, reorderLevel: 30, unit: "reams", unitPrice: 18.5 },
  { itemName: "Network Switch 24-Port", category: "IT Equipment", quantity: 4, reorderLevel: 3, unit: "pcs", unitPrice: 730 },
  { itemName: "External SSD 1TB", category: "IT Equipment", quantity: 0, reorderLevel: 5, unit: "pcs", unitPrice: 390 },
  { itemName: "Ergonomic Office Chair", category: "Furniture and Fixtures", quantity: 18, reorderLevel: 6, unit: "pcs", unitPrice: 680 },
  { itemName: "Height-adjustable Desk", category: "Furniture and Fixtures", quantity: 12, reorderLevel: 4, unit: "pcs", unitPrice: 1450 },
  { itemName: "Filing Cabinet", category: "Furniture and Fixtures", quantity: 7, reorderLevel: 3, unit: "pcs", unitPrice: 420 },
  { itemName: "Whiteboard 120 x 90 cm", category: "Office Supplies / Stationery", quantity: 5, reorderLevel: 2, unit: "pcs", unitPrice: 310 },
  { itemName: "Hand Sanitizer 500 ml", category: "Cleaning and Pantry Supplies", quantity: 36, reorderLevel: 12, unit: "bottles", unitPrice: 12.5 },
  { itemName: "Multi-purpose Cleaner", category: "Cleaning and Pantry Supplies", quantity: 22, reorderLevel: 8, unit: "bottles", unitPrice: 16.8 },
  { itemName: "Microfiber Cleaning Cloth", category: "Cleaning and Pantry Supplies", quantity: 60, reorderLevel: 20, unit: "pcs", unitPrice: 4.5 },
  { itemName: "First Aid Kit", category: "Operational Equipment", quantity: 3, reorderLevel: 3, unit: "sets", unitPrice: 95 },
  { itemName: "Fire Extinguisher 4 kg", category: "Operational Equipment", quantity: 8, reorderLevel: 3, unit: "pcs", unitPrice: 185 },
  { itemName: "Safety Signage Set", category: "Operational Equipment", quantity: 14, reorderLevel: 5, unit: "sets", unitPrice: 62 },
  { itemName: "Cardboard Shipping Box", category: "Raw Materials / Production Items", quantity: 250, reorderLevel: 80, unit: "pcs", unitPrice: 3.2 },
  { itemName: "Bubble Wrap Roll", category: "Raw Materials / Production Items", quantity: 8, reorderLevel: 4, unit: "rolls", unitPrice: 38 },
  { itemName: "Packing Tape", category: "Raw Materials / Production Items", quantity: 16, reorderLevel: 18, unit: "rolls", unitPrice: 7.5 },
  { itemName: "Bottled Drinking Water", category: "Cleaning and Pantry Supplies", quantity: 48, reorderLevel: 24, unit: "cartons", unitPrice: 18 },
  { itemName: "Coffee Beans 1 kg", category: "Cleaning and Pantry Supplies", quantity: 10, reorderLevel: 4, unit: "bags", unitPrice: 68 },
  { itemName: "LED Ceiling Light", category: "Maintenance and Repair Items", quantity: 20, reorderLevel: 8, unit: "pcs", unitPrice: 49 },
  { itemName: "Air Conditioner Filter", category: "Maintenance and Repair Items", quantity: 6, reorderLevel: 4, unit: "pcs", unitPrice: 85 },
  { itemName: "Workplace Safety Handbook", category: "Books / Training / Learning Materials", quantity: 15, reorderLevel: 5, unit: "pcs", unitPrice: 42 },
  { itemName: "Product Brochure", category: "Marketing and Printing Materials", quantity: 500, reorderLevel: 150, unit: "pcs", unitPrice: 1.8 },
  { itemName: "Printer Maintenance Service", category: "Services Procurement", quantity: 2, reorderLevel: 1, unit: "services", unitPrice: 280 },
].map((item) => ({
  ...item,
  taxType: "TAX",
  taxRate: 10,
  imageDataUrl: INVENTORY_IMAGE_URLS[item.itemName],
}));

function storageKey(supplierId: number): string {
  return `${STORAGE_PREFIX}_${supplierId}`;
}

function catalogueVersionKey(supplierId: number): string {
  return `${STORAGE_PREFIX}_catalogue_version_${supplierId}`;
}

function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `inventory-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadSupplierInventory(supplierId?: number): SupplierInventoryItem[] {
  if (!supplierId) return [];
  try {
    const raw = window.localStorage.getItem(storageKey(supplierId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSupplierInventory(supplierId: number, rows: SupplierInventoryItem[]): void {
  window.localStorage.setItem(storageKey(supplierId), JSON.stringify(rows));
  window.dispatchEvent(new Event("erp-supplier-inventory"));
}

export function seedSampleSupplierInventory(supplierId?: number): SupplierInventoryItem[] {
  const rows = loadSupplierInventory(supplierId);
  if (!supplierId) return rows;

  const names = new Set(rows.map((row) => row.itemName.trim().toLowerCase()));
  const isSampleInventory = names.has("laptop") && (
    rows.length === 1 || names.has("24-inch business monitor") || names.has("external ssd 1tb")
  );
  if (!isSampleInventory || localStorage.getItem(catalogueVersionKey(supplierId)) === SAMPLE_CATALOGUE_VERSION) return rows;

  const sampleItemsByName = new Map(SAMPLE_CATALOGUE.map((item) => [item.itemName.toLowerCase(), item]));
  const updatedRows = rows.map((row) => {
    const sampleItem = sampleItemsByName.get(row.itemName.trim().toLowerCase());
    return sampleItem
      ? {
        ...row,
        category: sampleItem.category,
        taxType: "TAX",
        taxRate: 10,
        imageDataUrl: row.imageDataUrl ?? sampleItem.imageDataUrl,
      }
      : { ...row, taxType: "TAX", taxRate: 10 };
  });
  const additions = SAMPLE_CATALOGUE
    .filter((item) => !names.has(item.itemName.toLowerCase()))
    .map((item) => createSupplierInventoryItem(supplierId, item));
  const seededRows = [...updatedRows, ...additions];
  saveSupplierInventory(supplierId, seededRows);
  localStorage.setItem(catalogueVersionKey(supplierId), SAMPLE_CATALOGUE_VERSION);
  return seededRows;
}

export function createSupplierInventoryItem(
  supplierId: number,
  values: Omit<SupplierInventoryItem, "id" | "supplierId" | "updatedAt">,
): SupplierInventoryItem {
  return {
    ...values,
    id: newId(),
    supplierId,
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchSupplierInventory(supplierId?: number): Promise<SupplierInventoryItem[]> {
  const response = await axios.get<{ success: boolean; items?: SupplierInventoryItem[]; message?: string }>(
    `${API_ROOT}/purchasing/inventory`,
    { params: supplierId ? { supplierId } : undefined },
  );
  if (!response.data?.success) throw new Error(response.data?.message ?? "Could not load inventory");
  return response.data.items ?? [];
}

export async function createSupplierInventory(item: Omit<SupplierInventoryItem, "id" | "updatedAt">): Promise<SupplierInventoryItem> {
  const response = await axios.post<{ success: boolean; item?: SupplierInventoryItem; message?: string }>(
    `${API_ROOT}/purchasing/inventory`,
    item,
  );
  if (!response.data?.success || !response.data.item) throw new Error(response.data?.message ?? "Could not add inventory item");
  return response.data.item;
}

export async function updateSupplierInventory(item: SupplierInventoryItem): Promise<SupplierInventoryItem> {
  const response = await axios.put<{ success: boolean; item?: SupplierInventoryItem; message?: string }>(
    `${API_ROOT}/purchasing/inventory/${item.id}`,
    item,
  );
  if (!response.data?.success || !response.data.item) throw new Error(response.data?.message ?? "Could not update inventory item");
  return response.data.item;
}

export async function deleteSupplierInventory(id: string): Promise<void> {
  const response = await axios.delete<{ success: boolean; message?: string }>(`${API_ROOT}/purchasing/inventory/${id}`);
  if (!response.data?.success) throw new Error(response.data?.message ?? "Could not delete inventory item");
}
import axios from "axios";

import { API_ROOT } from "../../shared/api/base";
