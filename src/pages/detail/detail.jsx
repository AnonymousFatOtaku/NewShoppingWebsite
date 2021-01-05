// 商城主页路由
import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Carousel, Menu, Button, Radio, InputNumber, Dropdown, Input, Pagination, message} from 'antd';
import {ArrowDownOutlined, BankOutlined} from '@ant-design/icons';
import "react-pullload/dist/ReactPullLoad.css";
import {formateDate} from "../../utils/dateUtils"
import logo from '../../assets/images/logo.jpg'
import './detail.less'
import './item.css'
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

export default class Detail extends Component {

  state = {
    allCategorys: [], // 所有分类列表
    categorys: [], // 一级分类列表
    products: [], // 所有商品列表
    searchName: '', // 搜索的关键字
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

  async componentDidMount() {
    document.title = "商品详情"
    this.getAllCategorys()
    this.getCategorys(0)
    this.getProducts()
    // 得到当前商品
    const product = this.props.location.state.product
    console.log(product)
  }

  render() {

    const {allCategorys, categorys, products, searchName,} = this.state
    console.log(allCategorys, categorys, products, searchName,)

    // 当前登录用户的用户名
    let username = ''
    if (cookieUtils.getUserCookie() !== undefined) {
      username = cookieUtils.getUserCookie()[0].username
      console.log(cookieUtils.getUserCookie())
    }

    // 得到当前商品
    const product = this.props.location.state.product
    console.log(product)

    // 获取分类名称
    let categoryId = product.fk_category_id
    let category = '', parentCategory = ''
    for (let i = 0; i < allCategorys.length; i++) {
      if (allCategorys[i].pk_category_id === categoryId) {
        category = allCategorys[i]
        if (category.parent_category_id !== 0) {
          for (let j = 0; j < allCategorys.length; j++) {
            if (allCategorys[j].pk_category_id === category.parent_category_id) {
              parentCategory = allCategorys[j]
            }
          }
        }
      }
    }
    console.log(categoryId, category, parentCategory)

    // 获取商品图片
    let image = []
    if (product.image) {
      image = product.image.split(",");
      console.log(image)
    }

    return (
      <div className="container" style={{backgroundColor: 'white'}}>
        <div className="nav">
          <div className="nav-box">
            <ul>
              <a style={{float: 'left', marginLeft: 400, marginTop: 5, color: 'grey'}} onClick={() => {
                this.props.history.push('/home')
              }}><BankOutlined/>&nbsp;京东首页</a>
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
        <div className="header-box">
          <div className="header">
            <div className="logo-box">
              <a onClick={() => {
                this.props.history.push('/home')
              }}>
                <img src={logo} alt="logo" style={{width: 190, height: 120}}/>
              </a>
            </div>
            <div className="search-box">
              <div className="search-bar">
                <Search placeholder="请输入要搜索的商品名" enterButton onSearch={this.searchProducts}/>
                <div className="cart-btn"><span
                  className="iconfont iconfont-cart">&#xe63b;</span>&nbsp;&nbsp;&nbsp;&nbsp;我的购物车
                </div>
              </div>
              <ul style={{marginTop: 40, textAlign: 'center'}}>
                {/* 遍历一级分类，只显示前10个 */}
                {
                  categorys.map((category, index) => index < 10 ?
                    <li><a value={category.pk_category_id} key={category.pk_category_id} onClick={() => {
                      let subCategory = null, isSearch = false
                      this.props.history.replace('/list', {category, subCategory, isSearch})
                      window.location.reload(true)
                    }}>{category.name}</a>
                    </li> : null)
                }
              </ul>
            </div>
          </div>
        </div>
        <div className='category-bar'>
          <span>{parentCategory !== '' ? parentCategory.name + '\n>\n' + category.name : category.name}</span>
        </div>
        <div className='product-info'>
          <div className="product inner clearfix">
            <div className="left">
              <div className="pic" id="bigItem">
                <img src={'http://localhost:2020/images/' + image[0]} style={{width: 350, height: 350}}/>
              </div>
              <div className="pics_box">
                <div className="arrow arrow_left" id="bigArrowL"></div>
                <div className="arrow arrow_right" id="bigArrowR"></div>
                <ul className="pic_list clearfix">
                  {
                    image.length > 0 ? image.map(img => (
                      <li className="small_pic">
                        <img key={img} src={'http://localhost:2020/images/' + img} className="product-img" alt="img"/>
                      </li>
                    )) : null
                  }
                </ul>
              </div>
            </div>
            <div className="right">
              <h2>{product.name}</h2>
              <p className="news">全店领券满88元减3元！</p>
              <div className="summary_price">
                <div className="comment_count">
                  <p className="comment">累计评价</p>
                  <a href="javascript:;">2100+</a>
                </div>
                <dl className="jd_price clearfix">
                  <dt>京 东 价</dt>
                  <dd>
                    <span>￥</span>{product.price / 100}
                    <span style={{
                      textDecoration: 'line-through',
                      marginLeft: 10,
                      fontSize: 12,
                      color: 'black'
                    }}>[￥29.00]</span>
                    <a href="javascript:;">降价通知</a>
                  </dd>
                </dl>
                <dl className="sale_price clearfix">
                  <dt>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</dt>
                  <dd><em>限购</em>该商品购买1-20件时享受单件价￥15.50，超出数量以结算价为准，仅限购买一次</dd>
                </dl>
              </div>
              <div className="quantity clearfix">
                <span>1</span>
                <div>
                  <span type="button" className="quan_btn" id="plusBtn">+</span>
                  <span type="button" className="quan_btn disabled" id="minusBtn">-</span>
                </div>
                <a type="button" className="add_btn" id="addButton">加入购物车</a>
              </div>
              <div className="local_tips">
                <dl className="clearfix">
                  <dt>温馨提示</dt>
                  <dd><em>·</em>支持7天无理由退货(拆封后不支持)</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className='product-detail'>
            <div className="fittings inner clearfix">
              <div className="tab_main">
                <ul className="clearfix">
                  <li style={{backgroundColor: "#e4393c", marginLeft: 300}}><a href="javascript:;"
                                                                               style={{color: "white"}}>商品介绍</a></li>
                  <li><a href="javascript:;" style={{color: "black"}}>规格与包装</a></li>
                  <li><a href="javascript:;" style={{color: "black"}}>售后保障</a></li>
                  <li><a href="javascript:;" style={{color: "black"}}>商品评价</a></li>
                </ul>
              </div>
            </div>
            <div className='product-description'>
              <span dangerouslySetInnerHTML={{__html: product.description}}/>
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