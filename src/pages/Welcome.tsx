import {
  AppstoreOutlined,
  CheckCircleOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Card, Space, Typography } from 'antd';
import React from 'react';

const { Title, Paragraph } = Typography;

const Welcome: React.FC = () => {
  return <PageContainer title="Welcome"></PageContainer>;
};

export default Welcome;
