import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Table, Typography } from "antd";
import { useNavigate } from "react-router-dom";

import { UserRole } from "../../shared/types/roles";

const { Text } = Typography;

export default function RoleSubmodule(): React.ReactElement {
  const navigate = useNavigate();
  const roles = Object.values(UserRole).map((role) => ({ key: role, role }));

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
          <span>Roles</span>
        </Flex>
      }
    >
      <Text type="secondary">Roles available when creating or assigning users.</Text>
      <Table
        size="small"
        style={{ marginTop: 16 }}
        pagination={false}
        dataSource={roles}
        columns={[{ title: "Role", dataIndex: "role", key: "role" }]}
      />
    </Card>
  );
}
