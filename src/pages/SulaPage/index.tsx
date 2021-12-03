import SulaForm from '@/components/SulaForm';
import { Form } from 'sula';
import styles from './index.less';

interface Props {}

function SulaPage(props: Props) {
  const config = {
    // initialValues: {
    //   hideParam: '隐藏的',
    // },
    fields: [
      {
        name: 'namessss',
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
          }
        },
        rules: [{ required: true, message: '请输入定金金额及条款' }],
      },
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
    ],
  };

  return (
    <div className={styles.sulaWrap}>
      <Form {...config} />
      {/* <SulaForm {...config} /> */}
    </div>
  );
}

export default SulaPage;
