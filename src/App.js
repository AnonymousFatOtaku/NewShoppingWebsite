// 应用的根组件，简单组件用函数定义，复杂组件用类定义，根据有没有状态来区分
import React, {Component} from "react";
import {BrowserRouter, Switch, Route} from 'react-router-dom'
// 引入组件，首字母必须大写
import Home from './pages/home/home'
import './assets/css/reset.css';
import './assets/css/common.css';
import './App.less';

export default class App extends Component {
  // 类组件必须有一个render方法，render方法必须返回一个虚拟DOM对象，用jsx的标签语法来写虚拟DOM对象
  render() {
    return (
      <BrowserRouter>
        <Switch>{/*只匹配其中一个*/}
          <Route path='/Home' component={Home}/>
          <Route path='/' component={Home}/>
        </Switch>
      </BrowserRouter>
    )
  }
}