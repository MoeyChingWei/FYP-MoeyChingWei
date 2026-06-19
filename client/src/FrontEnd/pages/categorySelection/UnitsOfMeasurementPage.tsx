import React from "react";
import { Button, Card, Flex } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import LookupKindTable from "./LookupKindTable";

export default function UnitsOfMeasurementPage(): React.ReactElement {
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
            aria-label="Back"
          />
          <span>Units of measurement</span>
        </Flex>
      }
    >
      <LookupKindTable kind="UNIT_OF_MEASURE" />
    </Card>
  );
}
