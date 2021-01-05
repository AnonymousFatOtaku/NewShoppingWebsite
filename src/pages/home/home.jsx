// 商城主页路由
import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Carousel, Menu, Form, Input, Button, Modal} from 'antd';
import {formateDate} from "../../utils/dateUtils"
import logo from '../../assets/images/logo.jpg'
import image1 from '../../assets/images/1.jpg'
import image2 from '../../assets/images/2.jpg'
import image3 from '../../assets/images/3.jpg'
import image4 from '../../assets/images/4.jpg'
import './home.less'
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

export default class Home extends Component {

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
    document.title = "商城主页"
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
      <div className="container">
        <div className="nav">
          <div className="nav-box">
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
        <div className="content">
          <div className="wrapper">
            <div className="menu-box" id="menu">
              <Menu>
                {
                  categorys.map((category, index) => index < 10 ?
                    <SubMenu value={category.pk_category_id} key={category.pk_category_id} title={<a onClick={() => {
                      let subCategory = null, isSearch = false
                      this.props.history.replace('/list', {category, subCategory, isSearch})
                      window.location.reload(true)
                    }} style={{color: 'black'}}>{category.name}</a>}>
                      {allCategorys.map((subCategory) => subCategory.parent_category_id === category.pk_category_id ?
                        <Menu.Item value={subCategory.pk_category_id}
                                   key={subCategory.pk_category_id}>
                          <a onClick={() => {
                            let isSearch = false
                            this.props.history.push('/list', {category, subCategory, isSearch})
                          }}>{subCategory.name}</a>
                        </Menu.Item> : null)}
                    </SubMenu> : null)
                }
              </Menu>
            </div>
            <div className="slider-box">
              <div className="slider" id="slider">
                <Carousel autoplay>
                  <div>
                    <img src={image1} style={contentStyle}/>
                  </div>
                  <div>
                    <img src={image2} style={contentStyle}/>
                  </div>
                  <div>
                    <img src={image3} style={contentStyle}/>
                  </div>
                  <div>
                    <img src={image4} style={contentStyle}/>
                  </div>
                </Carousel>
              </div>
            </div>
            <div className="new-box">
              <div className="user-info">
                <p>{username === '' ? 'Hi~欢迎逛京东！' : 'Hi~' + username}</p>
                {username === '' ? null : <a onClick={this.logout}>退出</a>}
                {username === '' ? <a href="/UserLogin">登录</a> : null}
                {username === '' ? <span style={{color: '#999'}}>&nbsp;|&nbsp;</span> : null}
                {username === '' ? <a href="/Register">注册</a> : null}
              </div>
            </div>
          </div>
          <div style={{height: 300, width: 1190, margin: 'auto'}}>
            <div style={{height: 300, width: 590, margin: 'auto', float: 'left', backgroundColor: 'white'}}>
              <div style={{
                fontSize: 24,
                fontWeight: 'bold',
                marginTop: 10,
                marginLeft: 20
              }}>{activePromotions.length > 0 ? activePromotions[0].name : null}</div>
              <div className="promotion-products">
                <ul>
                  {
                    promotionProductsFirst.map((product, index) => index < 3 ?
                      <li>
                        <a value={product.pk_product_id} key={product.pk_product_id} onClick={() => {
                          this.props.history.push('/detail', {product})
                        }}>
                          <div className="pic-box">
                            <img src={'http://localhost:2020/images/' + product.image}
                                 style={{width: 100, height: 100}}/>
                          </div>
                          <div className="name"><i>自营</i>{product.name}</div>
                          <div className="price"><i>¥</i>{product.price / 100}</div>
                        </a>
                      </li> : null)
                  }
                </ul>
              </div>
            </div>
            <div style={{height: 300, width: 590, margin: 'auto', float: 'right', backgroundColor: 'white'}}>
              <div style={{
                fontSize: 24,
                fontWeight: 'bold',
                marginTop: 10,
                marginLeft: 20
              }}>{activePromotions.length > 1 ? activePromotions[1].name : null}</div>
              <div className="promotion-products">
                <ul>
                  {
                    promotionProductsSecend.map((product, index) => index < 3 ?
                      <li>
                        <a value={product.pk_product_id} key={product.pk_product_id} onClick={() => {
                          this.props.history.push('/detail', {product})
                        }}>
                          <div className="pic-box">
                            <img src={'http://localhost:2020/images/' + product.image}
                                 style={{width: 100, height: 100}}/>
                          </div>
                          <div className="name"><i>自营</i>{product.name}</div>
                          <div className="price"><i>¥</i>{product.price / 100}</div>
                        </a>
                      </li> : null)
                  }
                </ul>
              </div>
            </div>
          </div>
          <div className="wrapper direction">
            <div className="content-box">
              <ul>
                {
                  products.map((product, index) => index < (10 * pageNum) ?
                    <li>
                      <a onClick={() => {
                        this.props.history.push('/detail', {product})
                      }}>
                        <div className="pic-box">
                          <img src={'http://localhost:2020/images/' + product.image}
                               style={{width: 150, height: 150}}/>
                        </div>
                        <div className="name"><i>自营</i>{product.name}</div>
                        <div className="price"><i>¥</i>{product.price / 100}</div>
                      </a>
                    </li> : null)
                }
              </ul>
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
      </div>
    )
  }
}