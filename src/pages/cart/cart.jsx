// 商城主页路由
import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Carousel, Menu, Form, Input, Button, Modal} from 'antd';
import {formateDate} from "../../utils/dateUtils"
import logo from '../../assets/images/logo.jpg'
import './cart.less'
import {
  reqCategorys,
  reqProducts,
  reqAllCategorys,
  reqPromotions,
  reqAllPromotionProducts,
  reqSearchProducts
} from '../../api/index'
import cookieUtils from "../../utils/cookieUtils";

const {SubMenu} = Menu;
const {Search} = Input;

export default class Cart extends Component {

  state = {
    allCategorys: [], // 所有分类列表
    categorys: [], // 一级分类列表
    products: [], // 所有商品列表
    activePromotions: [], // 所有正在进行的活动列表
    promotionProducts: [], // 所有参加活动的商品列表
    searchName: '', // 搜索的关键字
    pageNum: 1, // 商品分页
  }

  // 异步获取所有分类列表
  getAllCategorys = async () => {
    const result = await reqAllCategorys()
    console.log(result)
    if (result.status === 0) {
      this.setState({
        allCategorys: result.data
      })
    }
  }

  // 异步获取一/二级分类列表
  getCategorys = async (parent_category_id) => {
    const result = await reqCategorys(parent_category_id)
    console.log(result)
    if (result.status === 0) {
      this.setState({
        categorys: result.data
      })
    }
  }

  // 异步获取所有商品列表
  getProducts = async () => {
    let result = await reqProducts()
    console.log(result)
    if (result.status === 0) {
      this.setState({
        products: result.data,
      })
    }
  }

  // 异步获取所有正在进行的活动列表
  getPromotions = async () => {
    let result = await reqPromotions()
    console.log(result)

    let promotions = result.data
    let activePromotions = []
    let curDate = new Date();
    curDate = formateDate(curDate)
    for (let i = 0; i < promotions.length; i++) {
      let startTime = formateDate(promotions[i].start_time), endTime = formateDate(promotions[i].end_time)
      if (startTime < curDate && endTime > curDate) { // 正在进行中的活动
        activePromotions.push(promotions[i])
      }
    }
    console.log(activePromotions)

    if (result.status === 0) {
      this.setState({
        activePromotions: activePromotions,
      })
    }
  }

  // 异步获取所有参加活动的商品列表
  getPromotionProducts = async () => {
    let result = await reqAllPromotionProducts()
    console.log(result)
    if (result.status === 0) {
      this.setState({
        promotionProducts: result.data,
      })
    }
  }

  // 根据关键字搜索商品
  searchProducts = async (value) => {
    console.log(value)
    let result, searchType = 'productName'
    if (value) {
      let searchName = value
      result = await reqSearchProducts({searchName, searchType})
    }
    console.log(result)
    if (result.status === 0) {
      const productResults = result.data
      let isSearch = true
      this.props.history.push('/list', {value, productResults, isSearch})
    }
  }

  // 滚动到底加载下一页商品
  nextPage = (event) => {
    // 获取滚动数据
    let pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight);
    let viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
    let scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    console.log(pageHeight - viewportHeight - scrollHeight < 10)

    // 如果滚动到底加载下一页商品
    if (pageHeight - viewportHeight - scrollHeight < 10) {
      let pageNum = this.state.pageNum
      if (pageNum < 10) { // 商品总页数最多10页
        pageNum += 1
      }
      this.setState({
        pageNum: pageNum,
      })
    }
  }

  // 退出登录
  logout = () => {
    // 显示确认框
    Modal.confirm({
      content: '是否确认退出?',
      onOk: async () => {
        // 删除保存的user数据和token
        cookieUtils.removeUserCookie()
        localStorage.removeItem('token')
        window.location.reload(true)
      }
    })
  }

  componentDidMount() {
    document.title = "购物车"
    this.getAllCategorys()
    this.getCategorys(0)
    this.getProducts()
    this.getPromotions()
    this.getPromotionProducts()
    window.addEventListener('scroll', this.nextPage);
  }

  componentWillMount() {
    window.removeEventListener('scroll', this.nextPage);
  }

  render() {

    const {allCategorys, categorys, products, activePromotions, promotionProducts, searchName, pageNum,} = this.state
    console.log(allCategorys, categorys, products, activePromotions, promotionProducts, searchName, pageNum,)

    // 当前登录用户的用户名
    let username = ''
    if (cookieUtils.getUserCookie() !== undefined) {
      username = cookieUtils.getUserCookie()[0].username
      console.log(cookieUtils.getUserCookie())
    }

    const contentStyle = {
      width: 780,
      height: 470,
      color: '#fff',
      lineHeight: '160px',
      textAlign: 'center',
      background: '#364d79',
    };

    // 获取参加第一个活动的商品列表
    let promotionProductsOne = []
    let promotionProductsFirst = []
    if (activePromotions.length > 0) {
      for (let i = 0; i < promotionProducts.length; i++) {
        if (promotionProducts[i].fk_promotion_id === activePromotions[0].pk_promotion_id) {
          promotionProductsOne.push(promotionProducts[i].fk_product_id)
        }
      }
      for (let i = 0; i < products.length; i++) {
        if (promotionProductsOne.indexOf(products[i].pk_product_id) !== -1) {
          promotionProductsFirst.push(products[i])
        }
      }
      console.log(promotionProductsFirst)
    }

    // 获取参加第二个活动的商品列表
    let promotionProductsTwo = []
    let promotionProductsSecend = []
    if (activePromotions.length > 1) {
      for (let i = 0; i < promotionProducts.length; i++) {
        if (promotionProducts[i].fk_promotion_id === activePromotions[1].pk_promotion_id) {
          promotionProductsTwo.push(promotionProducts[i].fk_product_id)
        }
      }
      for (let i = 0; i < products.length; i++) {
        if (promotionProductsTwo.indexOf(products[i].pk_product_id) !== -1) {
          promotionProductsSecend.push(products[i])
        }
      }
      console.log(promotionProductsSecend)
    }

    return (
      <div className="container" style={{backgroundColor: 'white'}}>
        <div className="nav">
          <div className="nav-box" style={{width: 990, margin: '0 auto'}}>
            <ul>
              {username === '' ?
                <li>
                  <a href="/UserLogin">你好，请登录&nbsp;&nbsp;</a><a href="/Register" style={{color: 'red'}}>免费注册</a>
                </li> : null}
              {username === '' ? null : <li><a href="#">{username}</a></li>}
              <li><a href="#">我的订单</a></li>
              <li><a href="#">我的京东</a></li>
              <li><a href="#">京东会员</a></li>
              <li><a href="#" style={{color: 'red'}}>企业采购</a></li>
              <li><a href="#">客户服务</a></li>
              <li><a href="#">网站导航</a></li>
              <li><a href="#">手机京东</a></li>
            </ul>
          </div>
        </div>
        <div className="cart-header-box">
          <div className="header" style={{width: 990, margin: '0 auto'}}>
            <div className="logo-box">
              <a onClick={() => {
                this.props.history.push('/home')
              }}>
                <img src={logo} alt="logo" style={{width: 190, height: 50}}/>
              </a>
            </div>
            <div className="cart-search-box">
              <div className="cart-search-bar">
                <Search enterButton="搜索" onSearch={this.searchProducts}/>
              </div>
            </div>
          </div>
        </div>
        <div className="cart-body" style={{width: 990, margin: '0 auto'}}>
          <div className="cart-title">
            <h3>全部商品 121</h3>
          </div>
          <div className="cart-tips">
            <ul>
              <li><input type="checkbox"/>&nbsp;全选</li>
              <li>商品</li>
              <li>单价</li>
              <li>数量</li>
              <li>小计</li>
              <li>操作</li>
            </ul>
          </div>
          <div className="cart-products">
            <div className="info warp">
              <ul>
                <li className="info_1"><input type="checkbox"/></li>
                <li className="info_2"><img src={logo} width="80px"/></li>
                <li className="info_3"><a>心相印 厨房纸 吸油锁水 好擦免洗 吸油纸【沃尔玛】 75节/卷*2卷</a></li>
                <li className="info_4"><a>75节/卷*2卷</a></li>
                <li className="info_5">￥8.80</li>
                <li className="info_6">
                  <Input addonBefore="-" addonAfter="+" defaultValue="1" style={{width: 100}}/>
                </li>
                <li className="info_7">￥8.80</li>
                <li className="info_8">
                  <a>删除</a><br/>
                  <a>移入关注</a>
                </li>
              </ul>
            </div>
            <div className="info warp">
              <ul>
                <li className="info_1"><input type="checkbox"/></li>
                <li className="info_2"><img src={logo} width="80px"/></li>
                <li className="info_3"><a>心相印 厨房纸 吸油锁水 好擦免洗 吸油纸【沃尔玛】 75节/卷*2卷</a></li>
                <li className="info_4"><a>75节/卷*2卷</a></li>
                <li className="info_5">￥8.80</li>
                <li className="info_6">
                  <Input addonBefore="-" addonAfter="+" defaultValue="1" style={{width: 100}}/>
                </li>
                <li className="info_7">￥8.80</li>
                <li className="info_8">
                  <a>删除</a><br/>
                  <a>移入关注</a>
                </li>
              </ul>
            </div>
            <div className="info warp">
              <ul>
                <li className="info_1"><input type="checkbox"/></li>
                <li className="info_2"><img src={logo} width="80px"/></li>
                <li className="info_3"><a>心相印 厨房纸 吸油锁水 好擦免洗 吸油纸【沃尔玛】 75节/卷*2卷</a></li>
                <li className="info_4"><a>75节/卷*2卷</a></li>
                <li className="info_5">￥8.80</li>
                <li className="info_6">
                  <Input addonBefore="-" addonAfter="+" defaultValue="1" style={{width: 100}}/>
                </li>
                <li className="info_7">￥8.80</li>
                <li className="info_8">
                  <a>删除</a><br/>
                  <a>移入关注</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="cart-pay">
            <div className="balance">
              <ul className="balance_ul1">
                <li style={{marginLeft: 8}}><input type="checkbox"/>&nbsp;全选</li>
                <li>删除选中商品</li>
                <li>移入关注</li>
                <li>清理购物车</li>
              </ul>
              <ul className="balance_ul2">
                <li>已经选择<span>1</span>件商品</li>
                <li>总价<span>￥8.80</span></li>
                <li className="butt">去结算</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer">
          <ul>
            <li><a href="#">关于我们</a></li>
            <li><a href="#">联系我们</a></li>
            <li><a href="#">联系客服</a></li>
            <li><a href="#">合作招商</a></li>
            <li><a href="#">商家帮助</a></li>
            <li><a href="#">营销中心</a></li>
            <li><a href="#">手机京东</a></li>
            <li><a href="#">友情链接</a></li>
            <li><a href="#">销售联盟</a></li>
            <li><a href="#">京东社区</a></li>
            <li><a href="#">风险监测</a></li>
            <li><a href="#">隐私政策</a></li>
            <li><a href="#">京东公益</a></li>
            <li><a href="#">English Site</a></li>
            <li><a href="#">Media & IR</a></li>
          </ul>
        </div>
      </div>
    )
  }
}