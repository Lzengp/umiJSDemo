import React from 'react';
import ProForm, { ModalForm, ProFormProps } from '@ant-design/pro-form';
import { FormInstance, ModalProps } from 'antd';
// import { createFormModal as hookFormModal } from '@xtc/hooks';
import classnames from 'classnames';
import styles from './index.less';

interface Props extends Omit<ModalProps, 'onOk'> {
  proFormProps?: ProFormProps;
  renderForm: (form: FormInstance) => React.ReactNode;
  onOk?: (values: any, form: FormInstance) => void;
}

export default function createFormModal(props: Props) {
  const { proFormProps, renderForm, onOk, ...modalProps } = props;
  return (
    <ModalForm {...modalProps}>
      <ContentComponent onOk={onOk} renderForm={renderForm} proFormProps={proFormProps} />
    </ModalForm>
  );
}

class ContentComponent extends React.Component<{
  proFormProps?: ProFormProps;
  onOk?: (values: any, form: FormInstance) => void;
  renderForm: (form: FormInstance) => React.ReactNode;
}> {
  formRef = React.createRef<any>();

  submit() {
    const { onOk, proFormProps } = this.props;
    return this.formRef?.current?.validateFields().then(async (values: any) => {
      if (onOk) await onOk({ ...proFormProps?.initialValues, ...values }, this.formRef?.current);
    });
  }

  render() {
    const { proFormProps } = this.props;

    return (
      <ProForm
        layout="horizontal"
        {...proFormProps}
        className={classnames(styles.proForm, proFormProps?.className)}
        formRef={this.formRef}
      >
        {this.props.renderForm(this.formRef?.current)}
      </ProForm>
    );
  }
}
