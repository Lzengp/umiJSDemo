import React from 'react';
import { Dropdown, Menu, Avatar } from 'antd';
import { history, useSelector } from 'umi';
import { SettingOutlined, PoweroffOutlined, DownOutlined } from '@ant-design/icons';
import { client } from '@xtc/login/dist/kc';
import ModelState from '@/model';

interface Props {}

function UserOperate(props: Props) {
  const { currenrUser, role } = useSelector(mapState);
  const isAdmin = role.ROLE_ADMIN;

  return (
    <Dropdown
      overlay={
        <Menu>
          {isAdmin && (
            <Menu.Item key="1" onClick={() => history.push({ pathname: `/admin` })}>
              <SettingOutlined /> 管理
            </Menu.Item>
          )}
          <Menu.Item key="2" onClick={() => client.logout()}>
            <PoweroffOutlined /> 注销
          </Menu.Item>
        </Menu>
      }
    >
      <div style={{ cursor: 'pointer' }}>
        <Avatar src={currenrUser.avatar} style={{ marginLeft: 16, cursor: 'pointer' }}>
          {currenrUser.displayName[0]}
        </Avatar>
        <span style={{ margin: '0 8px' }}>{currenrUser.displayName}</span>
        <DownOutlined />
      </div>
    </Dropdown>
  );
}

const mapState = (state: ModelState) => ({
  currenrUser: state.oidc.user,
  role: state.oidc.role,
});

export default UserOperate;
