import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Flex } from "antd";
import { useNavigate } from "react-router-dom";

import LookupKindTable from "./LookupKindTable";

export default function PaymentTermsPage(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <Card
      title={
        <Flex align="center" gap={8}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/category-selection")}
            style={{ paddingInline: 0 }}
            aria-label="Back to Category Management"
          />
          <span>Payment terms</span>
        </Flex>
      }
    >
      <LookupKindTable kind="PAYMENT_TERM" />
    </Card>
  );
}
