import React from "react";
import { Card, Flex, Typography } from "antd";

const { Text } = Typography;

export default function SmartApprovalManagement(): React.ReactElement {
  return (
    <Flex vertical gap={16}>
      <Card title="Next steps">
        <Text>
          Add rule configuration UI, approval instance APIs, and any insight panels
          here when your backend is ready.
        </Text>
      </Card>
    </Flex>
  );
}
