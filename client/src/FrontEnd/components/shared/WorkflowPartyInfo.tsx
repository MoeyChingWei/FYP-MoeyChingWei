import React from "react";
import { getCompanyAddress, getCompanyLogo, getCompanyName, getSupplierCompanyAddress, getSupplierCompanyLogo, getSupplierCompanyName } from "../../modules/settings/companyAddress";
import styles from "./WorkflowPartyInfo.module.css";

export type PartyWorkflowType = "acknowledgement" | "delivery" | "grn";

interface Props {
  workflowType: PartyWorkflowType;
  record: any;
}

function value(input: unknown): string {
  return String(input ?? "").trim() || "-";
}

export default function WorkflowPartyInfo({ workflowType, record }: Props): React.ReactElement {
  const supplierId = Number(record?.supplierId);
  const supplierAddress = value(
    record?.supplierAddress ||
      record?.supplier?.address ||
      (Number.isFinite(supplierId) ? getSupplierCompanyAddress(supplierId) : ""),
  );
  const companyName = value(getCompanyName());
  const companyContact = value(record?.sourceRequester || record?.createdBy || companyName);
  const companyAddress = value(getCompanyAddress());
  const supplierName = value(
    record?.supplierCompanyName ||
      record?.supplierName ||
      (Number.isFinite(supplierId) ? getSupplierCompanyName(supplierId) : "") ||
      record?.supplierEmail,
  );
  const supplierEmail = value(record?.supplierEmail);
  const companyLogo = getCompanyLogo();
  const supplierLogo = record?.supplierLogo ||
    (Number.isFinite(supplierId) ? getSupplierCompanyLogo(supplierId) : "");
  const acknowledgement = workflowType === "acknowledgement";
  const sender = acknowledgement
    ? [["Company", companyName], ["Contact", companyContact], ["Address", companyAddress]]
    : [["Supplier", supplierName], ["Email", supplierEmail], ["Address", supplierAddress]];
  const receiver = acknowledgement
    ? [["Supplier", supplierName], ["Email", supplierEmail], ["Address", supplierAddress]]
    : [["Company", companyName], ["Contact", companyContact], ["Address", companyAddress]];

  const renderParty = (title: string, rows: string[][], logo: string): React.ReactElement => (
    <div className={styles.partyColumn}>
      {logo ? <img className={styles.partyLogo} src={logo} alt={`${title} logo`} /> : null}
      <h4 className={styles.partyTitle}>{title}</h4>
      {rows.map(([label, item]) => (
        <div className={styles.partyRow} key={label}>
          <span className={styles.partyLabel}>{label}</span>
          <span className={styles.partyValue}>{item}</span>
        </div>
      ))}
    </div>
  );

  return <div className={styles.partyGrid}>
    {renderParty("Sender", sender, acknowledgement ? companyLogo : supplierLogo)}
    {renderParty("Receiver", receiver, acknowledgement ? supplierLogo : companyLogo)}
  </div>;
}
