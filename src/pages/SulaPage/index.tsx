import { Form } from 'sula';

interface Props {}

function componentName(props: Props) {
  const config = {
    initialValues: {
      hideParam: '隐藏的',
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
    <div style={{ backgroundColor: '#FFF' }}>
      <Form {...config} />
    </div>
  );
}

export default componentName;
