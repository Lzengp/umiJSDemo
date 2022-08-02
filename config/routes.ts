export default [
  // {
  //     path: '/candidate',
  //     routes: [
  //       {
  //         name: 'login',
  //         path: '/candidate/login',
  //         component: './candidate/Login',
  //       },
  //       {
  //         component: './404',
  //       },
  //     ],
  // },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts',
    routes: [
      {
        path: '/welcome',
        name: 'welcome',
        icon: 'smile',
        component: './Welcome',
      },
      {
        path: '/admin',
        name: 'admin',
        icon: 'crown',
        access: 'canAdmin',
        component: './Admin',
        routes: [
          {
            path: '/admin/sub-page',
            name: 'sub-page',
            icon: 'smile',
            component: './Welcome',
          },
          {
            component: './404',
          },
        ],
      },
      {
        name: 'list.table-list',
        icon: 'table',
        path: '/list',
        component: './TableList',
      },
      {
        path: '/',
        redirect: '/welcome',
      },
      {
        name: 'mypage',
        icon: 'smile',
        path: '/myPage',
        component: './myPage',
      },
      {
        name: 'myDndPage',
        icon: 'smile',
        path: '/MyDndPage',
        component: './MyDndPage',
      },
      {
        name: 'sula页面',
        icon: 'smile',
        path: '/SulaPage',
        component: './SulaPage',
      },
      {
        // name: 'customerPortal',  
        name: '客户门户',
        icon: 'smile',
        path: '/CustomerPortal',
        component: './CustomerPortal',
        title: '客户门户'
      },
      {
        name: '串口调试',
        icon: 'smile',
        path: '/SerialPort',
        component: './SerialPort',
        title: '串口调试'
      },
      {
        path: '/personalTestPge',
        name: '个人测试页面',
        icon: 'crown',
        access: 'canAdmin',
        // component: './Admin',
        routes: [
          {
            path: '/personalTestPge/screenSharing',
            name: '屏幕共享',
            icon: 'smile',
            component: './PersonalTestPge/ScreenSharing',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },

];
