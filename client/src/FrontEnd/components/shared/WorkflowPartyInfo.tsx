import React from "react";
import { getCompanyAddress, getSupplierCompanyAddress } from "../../modules/settings/companyAddress";
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
  const companyName = value(record?.companyName || "OptiMind");
  const companyContact = value(record?.sourceRequester || record?.createdBy || companyName);
  const companyAddress = value(record?.companyAddress || getCompanyAddress());
  const supplierName = value(record?.supplierName || record?.supplierEmail);
  const supplierEmail = value(record?.supplierEmail);
  const acknowledgement = workflowType === "acknowledgement";
  const sender = acknowledgement
    ? [["Company", companyName], ["Contact", companyContact], ["Address", companyAddress]]
    : [["Supplier", supplierName], ["Email", supplierEmail], ["Address", supplierAddress]];
  const receiver = acknowledgement
    ? [["Supplier", supplierName], ["Email", supplierEmail], ["Address", supplierAddress]]
    : [["Company", companyName], ["Contact", companyContact], ["Address", companyAddress]];

  const renderParty = (title: string, rows: string[][]): React.ReactElement => (
    <div className={styles.partyColumn}>
      <h4 className={styles.partyTitle}>{title}</h4>
      {rows.map(([label, item]) => (
        <div className={styles.partyRow} key={label}>
          <span className={styles.partyLabel}>{label}</span>
          <span className={styles.partyValue}>{item}</span>
        </div>
      ))}
    </div>
  );

  return <div className={styles.partyGrid}>{renderParty("Sender", sender)}{renderParty("Receiver", receiver)}</div>;
}
