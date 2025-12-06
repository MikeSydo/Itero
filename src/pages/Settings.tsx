import { Outlet, useModel } from "@umijs/max";
import { Card, Switch, ColorPicker, Space, Typography } from 'antd';
import type { Color } from 'antd/es/color-picker';

const { Title, Text } = Typography;

export default function Settings() {
    const { initialState, setInitialState } = useModel('@@initialState');

    const handleThemeChange = (checked: boolean) => {
        setInitialState((prevState: any) => ({
            ...prevState,
            settings: {
                ...prevState.settings,
                navTheme: checked ? 'realDark' : 'light',
            },  
        }));
    };

    const handleColorChange = (color: Color) => {
        const hexColor = color.toHexString();
        setInitialState((prevState: any) => ({
            ...prevState,
            settings: {
                ...prevState.settings,
                colorPrimary: hexColor,
            },
        }));
    };

    const isDarkTheme = initialState?.settings?.navTheme === 'realDark';
    const primaryColor = initialState?.settings?.colorPrimary || '#1890ff';

    return (
        <>
            <Outlet/>
            <Space direction="horizontal">
                <Card title="Interface Settings" style={{ maxWidth: 600 }}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                            <div>
                                <Title level={5} style={{ margin: 0 }}>Dark Theme</Title>
                                <Text type="secondary">Switch between light and dark theme</Text>
                            </div>
                            <Switch 
                                checked={isDarkTheme}
                                onChange={handleThemeChange}
                        />
                        </Space>

                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                            <div>
                                <Title level={5} style={{ margin: 0 }}>Primary Color</Title>
                                <Text type="secondary">Choose your theme color</Text>
                            </div>
                            <ColorPicker 
                                value={primaryColor}
                                onChange={handleColorChange}
                                showText
                            />
                        </Space>
                    </Space>
                </Card>
            </Space>
        </>
    );
}