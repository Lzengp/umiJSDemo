import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { history, IRouteComponentProps, Link, useDispatch, useLocation, useModel, useRouteMatch, useSelector } from 'umi';
// import { BasicLayout } from '@xtc/pro-layout';
import styles from './index.less';
import * as Icon from '@ant-design/icons';
import ProLayout, { MenuDataItem, PageContainer } from '@ant-design/pro-layout';
import UserOperate from './components/UserOperate';
import { ConfigProvider } from 'antd';
import classnames from 'classnames';
import ProjectHeader from './components/ProjectHeader';
import defaultSettings from '../../config/defaultSettings';
import RightContent from '@/components/RightContent';
// import zhCN from '@/locales/zh-CN';
import zhCN from 'antd/lib/locale/zh_CN';
import { getTimeStrBySec } from '@/util';

const LayoutIndex = (props: IRouteComponentProps) => {
  // 需要对左侧菜单有高度自定义，建议直接通过 /api/menus 获取源数据自定义渲染
  const { route, ...restPrpos } = props; 
  const dispatch = useDispatch();
  const location = useLocation();
  const [collapsed, set_collapsed] = useState<boolean>(false);
  const pathname = location.pathname;
  //@ts-ignore
  const { view } = location.query;

  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    dispatch({ type: `oidc/fetchUserInfo` });
  }, []);

  // const menuList = useMemo(() => {
  //   return [
  //     {
  //       path: '/home',
  //       title: '首页概览',
  //       icon: 'DashboardOutlined',
  //       children: [{ path: '/home/theWholeLink', title: '全链路仪表盘' }],
  //     },
  //     {
  //       path: '/signAnalyse',
  //       title: '单点分析',
  //       icon: 'FormOutlined',
  //       children: [
  //         {
  //           path: '/signAnalyse/deliveryEta',
  //           title: '交付效率',
  //           children: [
  //             { path: '/signAnalyse/deliveryEta/deliveryEfficiency', title: '需求交付周期' },
  //             { path: '/signAnalyse/deliveryEta/demandDuration', title: '需求停留时长' },
  //           ],
  //         },
  //         {
  //           path: '/signAnalyse/deliveryQuality',
  //           title: '交付质量',
  //           children: [
  //             { path: '/signAnalyse/deliveryQuality/bugInventory', title: '缺陷库存' },
  //             { path: '/signAnalyse/deliveryQuality/bugSolveDuration', title: '缺陷解决时长' },
  //             { path: '/signAnalyse/deliveryQuality/bugFindDuration', title: '缺陷发现时长' },
  //             { path: '/signAnalyse/deliveryQuality/bugFindTrend', title: '缺陷发现趋势' },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       path: '/projectList',
  //       title: '项目列表',
  //       icon: 'UnorderedListOutlined',
  //     },
  //     {
  //       path: '/setting',
  //       title: '设置',
  //       icon: 'SettingOutlined',
  //       children: [
  //         { path: '/setting/functionConfig', title: '功能配置' },
  //         { path: '/setting/projectClass', title: '项目模板' },
  //         { path: '/setting/kanbanConfig', title: '看板配置' },
  //         { path: '/setting/checkConfig', title: 'check检查配置' },
  //         { path: '/setting/workItemState', title: '工作项状态配置' },
  //         { path: '/setting/priorityConfig', title: '优先级配置' },
  //       ],
  //     },
  //     {
  //       path: '/CustomerProtal',
  //       title: '客户门户',
  //       icon: 'SettingOutlined',
  //     },
  //   ];
  // }, []);

  // const layoutProps = {
  //   route: {
  //     path: '/',
  //     routes: menuList.map((item) => {
  //       //@ts-ignore
  //       const icon = Icon[item.icon] ? React.createElement(Icon[item.icon]) : null;

  //       return {
  //         path: item.path,
  //         name: item.title,
  //         access: item.path,
  //         icon,
  //         routes:
  //           item.children &&
  //           item.children.map((r) => ({
  //             path: r.path,
  //             name: r.title,
  //             //@ts-ignore
  //             routes: (r.children || []).map((row) => ({
  //               path: row.path,
  //               name: row.title,
  //             })),
  //           })),
  //       };
  //     }),
  //   },
  // };

  const isNoStylePage = useMemo(() => {
    return ['/home/theWholeLink', '/project/', '/bugFindDuration', '/bugFindTrend'].some((item) =>
      pathname.includes(item),
    );
  }, [pathname]);

  /**是否为项目详情页面 */
  const isProjectPage = useMemo(() => {
    return ['/project/'].some((item) => pathname.includes(item));
  }, [pathname]);

  const hideMenuHead = useMemo(() => {
    return view === 'iframe';
  }, [view]);

  /**是否为流程页面 */
  const isWorkflowPage = useMemo(() => {
    return ['/process'].some((item) => pathname.includes(item));
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => set_collapsed(isProjectPage), 700);
  }, [isProjectPage]);

  const isCustomerPortal = useMemo(() => {
    return ['/CustomerPortal'].some((item) => pathname.includes(item));
  }, [pathname]);

  const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => 
    menuList.map((item) => {
      return {
        ...item,
        children: item.children ? menuDataRender(item.children) : undefined,
      };
    });



    
  // 全局状态
  let timer: any = null;
  let { maxTime } = useSelector((state: any) => state.algorithm);

  useEffect(() => {
    if (maxTime == 100) {
      clearInterval(timer);
      countDownFn()
    }
  }, [maxTime]);

  const countDownFn = () => {
    timer = setInterval(() => {
      if (maxTime >= 0) {
        const countDownStr = getTimeStrBySec(maxTime);
 
        if (maxTime == 0) {
          // setVisible(true);
        }
        dispatch({type:`algorithm/fetchCountDownObj`,payload: { countDownStr, maxTime: --maxTime }})
      } else {
        clearInterval(timer);
      }
    }, 1000);
  };

  return (
    // <ConfigProvider locale={zhCN}>
      <ProLayout
         waterMarkProps={{
          content: initialState?.currentUser?.name,
        }}
        // {...layoutProps}
        // title="Lzengp"
        // menuHeaderRender={(logo, title) => (
        //   <div
        //     id="customize_menu_header"
        //     onClick={() => {
        //       window.open('https://remaxjs.org/');
        //     }}
        //   >
        //     {logo}
        //     {title}
        //   </div>
        // )}
        // layout="top"
        onMenuHeaderClick={() => history.push('/')} // 图标点击事件
        // onMenuHeaderClick={(e) => console.log(e)}
        menuItemRender={(menuItemProps, defaultDom) => {
          return (
            <Link
              // onClick={() => {
              //   localStorage.setItem('isMenuClick', 'true');
              // }}
              to={menuItemProps.path}
            >
              {defaultDom}
              {/* {menuItemProps.title} */}
            </Link>
          );
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: '',
          },
          ...routers,
        ]}
        menuDataRender={menuDataRender}
        onPageChange={() => {
          const { location } = history;
          // 如果没有登录，重定向到 login
          // if (!localStorage.getItem('userInfo') && location.pathname !== '/user/login') {
          //   history.push('/user/login');
          // }
        }}
        // headerContentRender={undefined}
        route={route}
        rightContentRender={() => <RightContent />}
        // breadcrumbRender={(routers = []) => [
        //   {
        //     path: '/',
        //     breadcrumbName: '',
        //   },
        //   ...routers,
        // ]}
        // className={classnames(
        //   styles.layout,
        //   (isNoStylePage || isWorkflowPage) && styles.noStylePage,
        //   isProjectPage && styles.projectPage,
        //   (hideMenuHead || isWorkflowPage) && styles.hideMenuHead,
        // )}
        // collapsed={collapsed}
        // onCollapse={set_collapsed}
        // location={window.location}
        // menuProps={{ onClick: ({ key }) => history.push(key) }}
        // rightContentRender={() => <UserOperate />}
        // headerContentRender={() => <ProjectHeader />}
        headerContentRender={() => (
          <div
            style={{ color: '#FFF', cursor: 'pointer', width: '60px' }}
            onClick={() => {
              const { location } = history;
              if (location.pathname !== '/welcome') {
                history.push('/welcome');
              }
            }}
          >
            Lzengp
          </div>
        )}
        siderWidth={isCustomerPortal ? 0 : 208} // 侧边菜单宽度, 默认208px
        pure={isCustomerPortal ? true : false}
        {...restPrpos}
        {...defaultSettings}
      >
        {/* <PageContainer>{props.children}</PageContainer> */}
        {props.children}
      </ProLayout>
    // </ConfigProvider>
  );
};

export default LayoutIndex;
