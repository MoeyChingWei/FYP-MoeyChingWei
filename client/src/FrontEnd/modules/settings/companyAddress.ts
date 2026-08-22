const COMPANY_ADDRESS_KEY = "erp_company_address_v1";
const SUPPLIER_COMPANY_ADDRESS_KEY_PREFIX = "erp_supplier_company_address_v1";
const COMPANY_NAME_KEY = "erp_company_name_v1";
const SUPPLIER_COMPANY_NAME_KEY_PREFIX = "erp_supplier_company_name_v1";
const COMPANY_LOGO_KEY = "erp_company_logo_v1";
const SUPPLIER_COMPANY_LOGO_KEY_PREFIX = "erp_supplier_company_logo_v1";

export const DEFAULT_COMPANY_ADDRESS =
  "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak";
export const DEFAULT_COMPANY_NAME = "OptiMind";

export function getCompanyName(): string {
  const value = localStorage.getItem(COMPANY_NAME_KEY);
  return value?.trim() || DEFAULT_COMPANY_NAME;
}

export function saveCompanyName(name: string): void {
  localStorage.setItem(COMPANY_NAME_KEY, name.trim() || DEFAULT_COMPANY_NAME);
  window.dispatchEvent(new Event("erp-company-name"));
}

export function getCompanyLogo(): string {
  return localStorage.getItem(COMPANY_LOGO_KEY)?.trim() || "";
}

export function saveCompanyLogo(logo: string): void {
  if (logo.trim()) localStorage.setItem(COMPANY_LOGO_KEY, logo);
  else localStorage.removeItem(COMPANY_LOGO_KEY);
  window.dispatchEvent(new Event("erp-company-logo"));
}

export function getCompanyAddress(): string {
  const value = localStorage.getItem(COMPANY_ADDRESS_KEY);
  return value?.trim() || DEFAULT_COMPANY_ADDRESS;
}

export function saveCompanyAddress(address: string): void {
  localStorage.setItem(COMPANY_ADDRESS_KEY, address.trim() || DEFAULT_COMPANY_ADDRESS);
  window.dispatchEvent(new Event("erp-company-address"));
}

function supplierCompanyAddressKey(supplierId: number): string {
  return `${SUPPLIER_COMPANY_ADDRESS_KEY_PREFIX}_${supplierId}`;
}

function supplierCompanyNameKey(supplierId: number): string {
  return `${SUPPLIER_COMPANY_NAME_KEY_PREFIX}_${supplierId}`;
}

function supplierCompanyLogoKey(supplierId: number): string {
  return `${SUPPLIER_COMPANY_LOGO_KEY_PREFIX}_${supplierId}`;
}

export function getSupplierCompanyName(supplierId: number): string {
  return localStorage.getItem(supplierCompanyNameKey(supplierId))?.trim() || "";
}

export function saveSupplierCompanyName(supplierId: number, name: string): void {
  localStorage.setItem(supplierCompanyNameKey(supplierId), name.trim());
  window.dispatchEvent(new Event("erp-supplier-company-name"));
}

export function getSupplierCompanyLogo(supplierId: number): string {
  return localStorage.getItem(supplierCompanyLogoKey(supplierId))?.trim() || "";
}

export function saveSupplierCompanyLogo(supplierId: number, logo: string): void {
  if (logo.trim()) localStorage.setItem(supplierCompanyLogoKey(supplierId), logo);
  else localStorage.removeItem(supplierCompanyLogoKey(supplierId));
  window.dispatchEvent(new Event("erp-supplier-company-logo"));
}

export function getSupplierCompanyAddress(supplierId: number): string {
  return localStorage.getItem(supplierCompanyAddressKey(supplierId))?.trim() || "";
}

export function saveSupplierCompanyAddress(supplierId: number, address: string): void {
  localStorage.setItem(supplierCompanyAddressKey(supplierId), address.trim());
  window.dispatchEvent(new Event("erp-supplier-company-address"));
}
