import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import {
  registerFieldPlugins,
  registerRenderPlugins,
  registerActionPlugins,
  registerFilterPlugins,
} from 'sula';
import './SulaPlugin';
// import 'antd/dist/antd.css'; // 引入antd主题
// import { UserOutlined } from '@ant-design/icons';

// 注册插件
registerFieldPlugins();
registerRenderPlugins();
registerActionPlugins();
registerFilterPlugins();

// 注册icon
// Icon.iconRegister({
//   user: UserOutlined
// })

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
// export const layout: RunTimeLayoutConfig = ({ initialState }) => {
//   console.log(history.location.pathname, initialState?.currentUser);
//   // const isCustomerPortal = history.location.pathname === '/CustomerPortal';

//   return {
//     rightContentRender: () => <RightContent />,
//     disableContentMargin: false,
//     waterMarkProps: {
//       content: initialState?.currentUser?.name,
//     },
//     footerRender: () => <Footer />,
//     onPageChange: () => {
//       const { location } = history;
//       // 如果没有登录，重定向到 login
//       if (!initialState?.currentUser && location.pathname !== loginPath) {
//         history.push(loginPath);
//       }
//     },
//     links: isDev
//       ? [
//           <Link to="/umi/plugin/openapi" target="_blank">
//             <LinkOutlined />
//             <span>OpenAPI 文档</span>
//           </Link>,
//           <Link to="/~docs">
//             <BookOutlined />
//             <span>业务组件文档</span>
//           </Link>,
//         ]
//       : [],
//     menuHeaderRender: undefined, // 自定义菜单栏头部
//     // menuHeaderRender: (logo, title) => (
//     //   <div
//     //     id="customize_menu_header"
//     //     onClick={() => {
//     //       window.open('https://remaxjs.org/');
//     //     }}
//     //   >
//     //     {logo}
//     //    我的
//     //   </div>
//     // ),
//     // collapsedButtonRender: false, // 折叠菜单图标按钮
//     // pure: true, // 删除所有自带的页面（左侧菜单，页面头部）
//     // siderWidth: isCustomerPortal ? 0 : 208, // 侧边菜单宽度, 默认208px
//     // 自定义 403 页面
//     // unAccessible: <div>unAccessible</div>,
//     ...initialState?.settings,
//   };
// };
