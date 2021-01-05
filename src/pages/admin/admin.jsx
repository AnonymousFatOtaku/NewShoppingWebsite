// 后台管理主路由组件
import React, {Component} from "react";
import {Route, Switch, Redirect} from 'react-router-dom';
import {Layout} from 'antd';
import Home from "../home/home";
import List from "../list/list";
import Detail from "../detail/detail";
import './admin.less';

const {Header, Footer, Sider, Content} = Layout;

export default class Admin extends Component {

  state = {
    menus: [], // 登录用户的权限数组
  }

  componentDidMount() {

  }

  render() {

    return (
      <Layout>
        <Content className="adminContent">
          <Switch>
            <Redirect from='/' exact to='/home'/>
            <Route path='/home' component={Home}/>
            <Route path='/list' component={List}/>
            <Route path='/detail' component={Detail}/>
          </Switch>
        </Content>
      </Layout>
    )
  }
}