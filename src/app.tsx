import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { ConfigProvider, theme } from 'antd';
import defaultSettings from '../config/defaultSettings';
import '@ant-design/v5-patch-for-react-19';
import { useLocation } from '@umijs/max';

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
}> {
  return {
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

export const layout = ({ initialState }: any) => {
  
  return {
    menu: {
      locale: false,
    },
    childrenRender: (children: any) => {
      const isDarkTheme = initialState?.settings?.navTheme === 'realDark';
      const primaryColor = initialState?.settings?.colorPrimary || '#1890ff';
      
      return (
        <ConfigProvider
          theme={{
            cssVar: true,
            algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: {
              colorPrimary: primaryColor,
              fontFamily: 'AlibabaSans, sans-serif',
            },
          }}
        >
          {children}
        </ConfigProvider>
      );
    },
    ...initialState?.settings,
  };
};