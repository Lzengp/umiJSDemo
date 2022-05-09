import { Button, Input } from 'antd';
import styles from './index.less';
import leftImg from '@/assets/left.png';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useRef } from 'react';
import { FormattedMessage } from 'umi';

const CandidateLogin = () => {
  const formRef = useRef();

  return (
    <div className={styles.candidateLoginWrap}>
      <img className={styles.leftBg} src={leftImg} />
      <div className={styles.main}>
        <div className={styles.companyName}>公司入职填报</div>
        <ProForm
          submitter={{
            searchConfig: {
              submitText: '登录',
            },
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              // loading: submitting,
              size: 'large',
              style: {
                width: '100%',
              },
            },
          }}
          onFinish={async (values) => {
            console.log(values);
            // handleSubmit(values);
          }}
          formRef={formRef}
        >
          {/* <ProForm.Group>
    
          </ProForm.Group> */}
          {/* <ProForm.Group> */}
          <ProFormText
            name="name"
            // label="姓名"
            // fieldProps={{
            //   size: 'large',
            //   prefix: "姓名",
            // }}
            width="lg"
            rules={[
              {
                required: true,
                message: '姓名是必填项',
              },
            ]}
            placeholder="姓名"
          />
          <ProFormText
            placeholder="手机号码"
            name="phone"
            // label="手机号码"
            width="lg"
            rules={[
              {
                required: true,
                message: '手机号码是必填项',
              },
            ]}
          />
          {/* <div style={{ display: 'flex' }}> */}
          <ProFormText
            placeholder="验证码"
            name="verificationCode"
            // label="验证码"
            width="lg"
            rules={[
              {
                required: true,
                message: '验证码是必填项',
              },
            ]}
          />

          <Button
            onClick={() => {
              formRef.current?.validateFieldsReturnFormatValue?.().then((val) => {
                // 以下为格式化之后的表单值
                console.log(val);
              });
              // formRef.current?.validateFields().then((res:any) => {
              //   console.log(res)
              // });
              // console.log(formRef.current?.validateFields())
              /**@ts-ignore */
              const { name, phone, verificationCode } = formRef.current?.getFieldsValue();
              if (!verificationCode) {
              }
              // console.log(name, phone, verificationCode);
            }}
          >
            发送验证码
          </Button>

          {/* </div> */}

          {/* </ProForm.Group> */}
        </ProForm>

        {/* <div>
          <span>姓名：</span>
          <Input />
        </div>
        <div>
          <span>手机号码：</span>
          <Input />
        </div>
        <div>
          <span>验证码：</span>
          <Input />
          <Button>发送验证码</Button>
        </div>
        <div>
          <Button>登录</Button>
        </div> */}
      </div>
    </div>
  );
};

export default CandidateLogin;
