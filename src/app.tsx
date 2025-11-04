import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import '@ant-design/v5-patch-for-react-19';

const isDev = process.env.NODE_ENV === 'development';
const isDevOrTest = isDev || process.env.CI;

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
}> {
  return {
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

export const layout = ({ initialState, setInitialState }: any) => {
  return {
    menu: {
      locale: false,
    },
    childrenRender: (children: any) => {
      return (
        <>
          {children}
          {isDevOrTest && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings: any) => {
                setInitialState((preInitialState: any) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置для Itero API
 * Базується на axios та ahooks useRequest
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: any = {
  // В режимі розробки використовуємо проксі, в продакшені - повний URL
  baseURL: isDev ? '' : process.env.API_URL || 'http://localhost:3001',
  timeout: 10000,
  ...errorConfig,
};
