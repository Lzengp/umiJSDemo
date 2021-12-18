import SulaForm from '@/components/SulaForm';
import { ProFormInstance } from '@ant-design/pro-form';
import { useEffect } from 'react';
import { Form } from 'sula';
import SulaTable from './components/SulaTable';
import styles from './index.less';

interface Props {}

function SulaPage(props: Props) {
  const config = {
    initialValues: {
      // hideParam: '隐藏的',
      name: '龙伟',
      ages: '',
      address: '湖南衡阳',
    },
    fields: [
      {
        name: 'name',
        label: '姓名',
        field: {
          type: 'input',
          props: {
            placeholder: '请输入',
          },
        },
        rules: [{ required: true, message: '请输入姓名' }],
      },
      {
        name: 'ages',
        label: '年龄',
        field: {
          type: 'inputnumber',
          props: {
            placeholder: '请输入',
            max: 100,
            min: 1,
            style: {
              width: '100%',
            },
          },
        },
        /**
         * 控制显隐
         * 需求：当当前字段为空的时候，不展示此字段
         */
        dependency: {
          visible: {
            relates: ['ages'],
            type: (ctx: any) => {
              if (!ctx.values[0]) {
                ctx.form.setFieldVisible(ctx.name, false);
              } 
            },
          },
        },
        rules: [{ required: true, message: '请输入年龄' }],
      },
      {
        name: 'address',
        label: '地址',
        field: {
          type: 'textarea',
          props: {
            placeholder: '请输入',
          },
        },
        rules: [{ required: true, message: '请输入地址' }],
      },
      {
        name: 'deposit',
        label: '定金',
        initialSource: [
          { text: '收定金', value: 10 },
          { text: '付定金', value: 20 },
          { text: '无定金', value: 30 },
        ],
        field: {
          type: 'select',
          props: {
            placeholder: '请选择定金',
          },
        },
        rules: [{ required: true, message: '请选择定金' }],
      },
      {
        name: 'depositInfo',
        label: '定金金额及条款',
        initialVisible: false,
        field: {
          type: 'textarea',
          props: {
            placeholder: '请输入定金金额及条款',
            rows: 4,
          },
        },
        dependency: {
          visible: {
            relates: ['deposit'],
            inputs: [[10, 20]],
            output: true,
            defaultOutput: false,
          },
        },
        rules: [{ required: true, message: '请输入定金金额及条款' }],
      },
      {
        name: 'fruits',
        lable: '水果',
        initialSource: [
          {
            text: '苹果 🍎',
            value: 'apple',
          },
          {
            text: '桃子 🍑',
            value: 'peach',
          },
          {
            text: '西瓜 🍉',
            value: 'watermelon',
            disabled: true,
          },
        ],
        // initialValue: ['peach'],
        field: {
          type: 'checkboxgroup',
          props: {
            onChange: (e) => { console.log(e)}

            // styles: { margin: '0 50px' }
          }
        },
        rules: [{ required: true, message: '水果' }],
      }
    ],
    actionsRender: [
      {
        type: 'button',
        props: {
          type: 'primary',
          children: '提交',
        },
        action: [
          'validateFields',
          { type: 'assignResult', args: [{ hello: 'kitty' }] },
          {
            url: 'https://www.mocky.io/v2/5ed7a8b63200001ad9274ab5',
            // method: 'post',
            params: ({ result }: { result: any }) => ({
              ...result,
            }),
          },
     
        ],
        
      },
      {
        type: 'button',
        props: {
          children: '取消',
        },
        visible: ({ form }: { form: ProFormInstance}) => {
          console.log('xxxxxx', form, form.getFieldValue('ages'))
        },
        // action: [
          
        // ]
       
      },
    ],
  };

  /**自己创建的dom节点位置固定，就是之前分页的位置，这样只要监听新节点的位置，就知道分页样式什么时候是fixed布局什么时候是正常的布局
   * fixed布局：当新dom节点消失在视窗的时候
   * 正常布局（initial）：当新dom节点出现在视窗的时候
   */
  const listenerDom = () => {
    /**这种是使用自己创建的元素来作为参考定位 */
    // const position = document.querySelector('.myDiv')?.getBoundingClientRect() || { bottom: 0 }; // 当前元素的位置

    /**这种是使用ant-table-body来作为参考定位, 只要tableBody的bottom + 分页高度一半就要fixed布局
     * 并且分页是不能超出表头的，所以tableBody的top + 200px就又要隐藏分页（恢复initial布局）
     */
    const tableBody = document.querySelector('.ant-table-tbody')?.getBoundingClientRect() || {
      bottom: 0,
      top: 0,
    };

    const vHeight = window.innerHeight || document.documentElement.clientHeight; // 视窗
    const antdPagination: any = document.querySelector('.ant-pagination'); // 实际分页dom

    // if (antdPagination && (position.bottom > vHeight || position.bottom === vHeight)) {
    
    /**设置分页悬浮（添加fixed布局） */
    if (antdPagination) {
      if (tableBody.bottom + 64 >= vHeight && tableBody.top + 100 <= vHeight) {
        antdPagination.style.position = 'fixed';
        antdPagination.style.bottom = '-16px';
        antdPagination.style.width = 'calc(100% - 288px)';
        antdPagination.style.background = '#FFF';
        antdPagination.style.height = '64px';
        antdPagination.style.display = 'flex';
        antdPagination.style.alignItems = 'center';
        antdPagination.style.justifyContent = 'flex-end';
        antdPagination.style.zIndex = '10';
      } else {
        // if (antdPagination && position.bottom < vHeight) {
        antdPagination.style.position = 'initial';
        antdPagination.style.display = 'flex';
        antdPagination.style.justifyContent = 'flex-end';
        antdPagination.style.width = '100%';
        antdPagination.style.zIndex = '10';
      }
    }

    /**设置表头悬浮（表头添加fixed布局） */
    const tableTitle: any = document.querySelector('.ant-table-thead1'); // 获取表头dom
    if (tableTitle) {
      if (tableBody.top - 75 <= 0) { // 在fixed布局中，不考虑表头和tablebody.bottom同水平的需要正常展示表头
        tableTitle.style.position = 'fixed';
        tableTitle.style.top = '45px';
        tableTitle.style.zIndex = '10';
      } else {
        tableTitle.style.position = 'initial';
      }

    }
  };

  /**监听创建的dom节点位置 */
  useEffect(() => {
    // createEle();
    window.addEventListener('scroll', listenerDom, false);
    return () => {
      window.removeEventListener('scroll', listenerDom, false);
    };
  }, []);

  /**创建一个dom节点，作为一个判断依据 */
  const createEle = () => {
    if (!document.querySelector('.myDiv')) {
      const el = document.createElement('div');
      el.id = 'myDiv';
      el.className = 'myDiv';
      // el.innerText = '我的div';
      // el.style.background = 'red';
      // el.style.height = '30px';
      document.querySelector('.ant-spin-container')?.appendChild(el);
    }
  };

  console.log('aaaaaaaaaaaaaaaaaa')

  return (
    <div className={styles.sulaWrap}>
      <Form {...config} className={styles.sulaFormWrap}/>
      <div className={styles.sulaTableTest}>
        测试
        <div className={styles.qiantaoStyle}>样式</div>  
      </div>
      <div style={{ borderTop: '20px solid #f0f2f5' }} />
      {/* <SulaForm {...config} /> */}
      <SulaTable />
    </div>
  );
}

export default SulaPage;
