import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Table, Typography } from "antd";
import { useNavigate } from "react-router-dom";

import { DEPARTMENT_OPTIONS } from "../../shared/constants/departments";

const { Text } = Typography;

export default function DepartmentSubmodule(): React.ReactElement {
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
          <span>Departments</span>
        </Flex>
      }
    >
      <Text type="secondary">Departments available for user assignment.</Text>
      <Table
        size="small"
        style={{ marginTop: 16 }}
        rowKey="value"
        pagination={false}
        dataSource={DEPARTMENT_OPTIONS}
        columns={[{ title: "Department", dataIndex: "label", key: "label" }]}
      />
    </Card>
  );
}
