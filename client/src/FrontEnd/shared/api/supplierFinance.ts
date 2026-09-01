import axios from "axios";

import { API_ROOT } from "./base";
import { getSessionUser } from "../auth/session";
import { getCompanyLogo } from "../../modules/settings/companyAddress";
import type { SupplierGrnRecord, SupplierInvoiceRecord, SupplierPaymentRecord } from "../../modules/supplierFulfillment/workflow";

const API = `${API_ROOT}/supplier-finance`;

function actor(): { userId: number; email: string } {
  const user = getSessionUser();
  if (!user) throw new Error("You must be signed in to perform this action");
  return { userId: user.id, email: user.email };
}

function message(error: unknown, fallback: string): Error {
  if (axios.isAxiosError(error) && error.response?.data?.message) return new Error(String(error.response.data.message));
  return new Error(fallback);
}

export async function createSupplierInvoiceFromReceivedGrn(grn: SupplierGrnRecord): Promise<SupplierInvoiceRecord> {
  try {
    const response = await axios.post(`${API}/invoices/from-grn`, { ...actor(), grn });
    return response.data.invoice as SupplierInvoiceRecord;
  } catch (error) { throw message(error, "Unable to create supplier invoice"); }
}

export async function loadSupplierFinanceInvoices(): Promise<SupplierInvoiceRecord[]> {
  try {
    const response = await axios.get(`${API}/invoices`, { params: actor() });
    return Array.isArray(response.data?.invoices) ? response.data.invoices as SupplierInvoiceRecord[] : [];
  } catch (error) { throw message(error, "Unable to load supplier invoices"); }
}

export async function loadSupplierFinancePayments(): Promise<SupplierPaymentRecord[]> {
  try {
    const response = await axios.get(`${API}/payments`, { params: actor() });
    return Array.isArray(response.data?.payments) ? response.data.payments as SupplierPaymentRecord[] : [];
  } catch (error) { throw message(error, "Unable to load supplier payments"); }
}

export async function submitSupplierInvoice(localId: string): Promise<SupplierInvoiceRecord> {
  try {
    const response = await axios.post(`${API}/invoices/${encodeURIComponent(localId)}/submit`, actor());
    return response.data.invoice as SupplierInvoiceRecord;
  } catch (error) { throw message(error, "Unable to submit supplier invoice"); }
}

export async function approveSupplierInvoice(localId: string): Promise<{ invoice: SupplierInvoiceRecord; payment: SupplierPaymentRecord }> {
  try {
    const response = await axios.post(`${API}/invoices/${encodeURIComponent(localId)}/approve`, actor());
    return response.data as { invoice: SupplierInvoiceRecord; payment: SupplierPaymentRecord };
  } catch (error) { throw message(error, "Unable to approve supplier invoice"); }
}

export async function rejectSupplierInvoice(localId: string, reason: string): Promise<SupplierInvoiceRecord> {
  try {
    const response = await axios.post(`${API}/invoices/${encodeURIComponent(localId)}/reject`, { ...actor(), reason });
    return response.data.invoice as SupplierInvoiceRecord;
  } catch (error) { throw message(error, "Unable to reject supplier invoice"); }
}

export async function processSupplierPayment(
  localId: string,
  input: { paymentMethod: string; paidDate: string; transactionReference: string; remarks?: string; attachment: Pick<SupplierPaymentRecord, "attachmentName" | "attachmentType" | "attachmentDataUrl"> },
): Promise<SupplierPaymentRecord> {
  try {
    const response = await axios.post(`${API}/payments/${encodeURIComponent(localId)}/process`, { ...actor(), ...input });
    return response.data.payment as SupplierPaymentRecord;
  } catch (error) { throw message(error, "Unable to process payment"); }
}

export type SupplierBankDetails = { bankName: string; accountName: string; accountNumber: string };

export async function getSupplierBankDetails(): Promise<SupplierBankDetails> {
  try {
    const response = await axios.get(`${API}/bank-details`, { params: actor() });
    return response.data.bankDetails as SupplierBankDetails;
  } catch (error) { throw message(error, "Unable to load bank details"); }
}

export async function saveSupplierBankDetails(bankDetails: SupplierBankDetails): Promise<SupplierBankDetails> {
  try {
    const response = await axios.put(`${API}/bank-details`, { ...actor(), ...bankDetails });
    return response.data.bankDetails as SupplierBankDetails;
  } catch (error) { throw message(error, "Unable to save bank details"); }
}

export function supplierFinancePdfUrl(kind: "invoices" | "payments", localId: string): string {
  const identity = actor();
  const params = new URLSearchParams({ userId: String(identity.userId), email: identity.email });
  return `${API}/${kind}/${encodeURIComponent(localId)}/pdf?${params.toString()}`;
}

export function supplierFinancePrintUrl(kind: "invoices" | "payments", localId: string): string {
  const identity = actor();
  const params = new URLSearchParams({ userId: String(identity.userId), email: identity.email });
  return `${API}/${kind}/${encodeURIComponent(localId)}/print?${params.toString()}`;
}

/** Data supplied with document requests so legacy records use the current logo. */
export function supplierFinanceDocumentPayload(): { userId: number; email: string; companyLogo?: string } {
  const identity = actor();
  const companyLogo = getCompanyLogo();
  return companyLogo ? { ...identity, companyLogo } : identity;
}
