import React, { useEffect, useState } from "react";
import { Input, Modal, Typography } from "antd";

const { Paragraph } = Typography;

type RejectReasonModalProps = {
  open: boolean;
  title: string;
  itemLabel: string;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
};

export default function RejectReasonModal({
  open,
  title,
  itemLabel,
  onCancel,
  onConfirm,
}: RejectReasonModalProps): React.ReactElement {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) {
      setReason("");
    }
  }, [open]);

  const trimmedReason = reason.trim();

  return (
    <Modal
      open={open}
      title={title}
      okText="Confirm Reject"
      okButtonProps={{ danger: true, disabled: !trimmedReason }}
      onCancel={onCancel}
      onOk={() => onConfirm(trimmedReason)}
      destroyOnHidden
    >
      <Paragraph type="secondary" style={{ marginBottom: 12 }}>
        Please provide a reject description for <strong>{itemLabel}</strong> before continuing.
      </Paragraph>
      <Input.TextArea
        autoSize={{ minRows: 4, maxRows: 7 }}
        placeholder="Enter reject description..."
        value={reason}
        onChange={(event) => setReason(event.target.value)}
      />
    </Modal>
  );
}
