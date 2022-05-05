import { useDispatch, useSelector } from '@/.umi/plugin-dva/exports';
import ModelState from '@/model';
import {
  CaretDownOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
  StarOutlined,
} from '@ant-design/icons';
import ProForm from '@ant-design/pro-form';
import { Divider, Dropdown, Form, Menu, Popover, Tabs } from 'antd';
import classNames from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle, CSSProperties } from 'react';
import { history, useLocation } from 'umi';
import styles from './index.less';

interface Props {
  style?: CSSProperties;
  className?: string;
}

function ProjectHeader(props: Props, ref: any) {
  const { style, className } = props;
  const { projectId, projectFeatures, detail, projectList } = useSelector(mapState);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!projectList.length) dispatch({ type: `project/fetchProjectList` });
  }, []);

  useImperativeHandle(ref, () => ({}));

  if (!detail || !Array.isArray(projectFeatures)) return null;
  return (
    <div style={style} className={classNames(styles.projectHeader, className)}>
      <div className={styles.leftContent}>
        <div className={styles.btn} onClick={() => history.push(`/projectList`)}>
          <HomeOutlined style={{ marginRight: 8 }} />
          首页
        </div>
        <Dropdown
          overlay={
            <Menu>
              {projectList.map((item) => (
                <Menu.Item
                  key={item.id}
                  disabled={item.id === projectId}
                  style={{ color: item.id === projectId ? '#1890ff' : undefined }}
                  onClick={() => history.push(`/project/${item.id}`)}
                >
                  {item.name}
                </Menu.Item>
              ))}
            </Menu>
          }
        >
          <span className={styles.btn}>
            {detail.name}
            <CaretDownOutlined style={{ marginLeft: 8 }} />
          </span>
        </Dropdown>
        <StarOutlined title="星标" onClick={() => {}} />
        <Popover
          placement="bottom"
          trigger="click"
          content={
            <div className={styles.projectInfo}>
              <div className={styles.thumbnail} />
              <Form.Item label="项目名称">{detail.name}</Form.Item>
              <Form.Item label="别名">{detail.alias}</Form.Item>
            </div>
          }
        >
          <ExclamationCircleOutlined title="项目信息" />
        </Popover>
      </div>
      <Divider type="vertical" className={styles.vertical} />
      <Tabs className={styles.tabs} activeKey={location.pathname} onChange={(val) => history.push(val)}>
        {projectFeatures.map((item) => (
          <Tabs.TabPane key={item.url} tab={item.name} />
        ))}
      </Tabs>
    </div>
  );
}

const mapState = (state: ModelState) => ({
  projectId: state.project.projectId,
  detail: state.project.detail,
  projectFeatures: state.project.projectFeatures,
  projectList: state.project.projectList,
});

export default forwardRef(ProjectHeader);
