import { history } from '@umijs/max';
import { Button, Card, Result } from 'antd';
import React from 'react';

const NoFoundPage: React.FC = () => (
  <Card variant="borderless">
    <Result
      status="404"
      title="404"
      subTitle="Вибачте, сторінка, яку ви відвідали, не існує."
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          Повернутись на головну
        </Button>
      }
    />
  </Card>
);

export default NoFoundPage;
