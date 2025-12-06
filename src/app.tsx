import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { ConfigProvider, theme, Button } from 'antd';
import enUS from 'antd/locale/en_US';
import defaultSettings from '../config/defaultSettings';
import '@ant-design/v5-patch-for-react-19';

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
}> {
  return {
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

export const layout = ({ initialState }: any) => {
  const isDarkTheme = initialState?.settings?.navTheme === 'realDark';
  
  return {
    menu: {
      locale: false,
    },
    headerTitleRender: (logo: any, title: any) => (
      <div style={{ cursor: 'default', display: 'flex', alignItems: 'center' }}>
        {logo}
        {title}
      </div>
    ),
    rightContentRender: () => {
      if (window.electronAPI) {
        return (
          <div style={{ display: 'flex', gap: 0, WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
            <Button
              type="text"
              onClick={() => window.electronAPI?.minimizeWindow()}
              style={{ 
                color: isDarkTheme ? 'white' : '#000', 
                fontSize: 16,
                width: 46,
                height: 46,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 4,
                WebkitAppRegion: 'no-drag'
              } as React.CSSProperties}
            >
              −
            </Button>
            <Button
              type="text"
              onClick={() => window.electronAPI?.maximizeWindow()}
              style={{ 
                color: isDarkTheme ? 'white' : '#000', 
                fontSize: 16,
                width: 46,
                height: 46,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                WebkitAppRegion: 'no-drag'
              } as React.CSSProperties}
            >
              □
            </Button>
            <Button
              type="text"
              onClick={() => window.electronAPI?.closeWindow()}
              style={{ 
                color: isDarkTheme ? 'white' : '#000', 
                fontSize: 16,
                width: 46,
                height: 46,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                WebkitAppRegion: 'no-drag'
              } as React.CSSProperties}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e81123'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              ✕
            </Button>
          </div>
        );
      }
      return null;
    },
    childrenRender: (children: any) => {
      const isDarkTheme = initialState?.settings?.navTheme === 'realDark';
      const primaryColor = initialState?.settings?.colorPrimary || '#1890ff';
      
      return (
        <ConfigProvider
          locale={enUS}
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