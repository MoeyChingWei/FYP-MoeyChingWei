const COMPANY_ADDRESS_KEY = "erp_company_address_v1";

export const DEFAULT_COMPANY_ADDRESS =
  "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak";

export function getCompanyAddress(): string {
  const value = localStorage.getItem(COMPANY_ADDRESS_KEY);
  return value?.trim() || DEFAULT_COMPANY_ADDRESS;
}

export function saveCompanyAddress(address: string): void {
  localStorage.setItem(COMPANY_ADDRESS_KEY, address.trim() || DEFAULT_COMPANY_ADDRESS);
  window.dispatchEvent(new Event("erp-company-address"));
}
