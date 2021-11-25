import React, { useState, useEffect, useMemo } from 'react';
import { CreateForm } from 'sula';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

function SulaForm(props: any) {
  const [value, setValue] = useState(props);

  const config = useMemo(() => {
    return {
      layout: 'horizontal',
      actionsPosition: 'bottom',
      ...value,
    };
  }, [value]);

  useEffect(() => {
    setValue(props);
  }, [props]);

  return (
    <PageHeaderWrapper title={false}>
      <div className="sula-form">
        <CreateForm {...config} />
      </div>
    </PageHeaderWrapper>
  );
}

export default React.memo(SulaForm);