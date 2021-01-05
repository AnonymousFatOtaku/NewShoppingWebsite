// 商城主页路由
import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Carousel, Menu, Button, Radio, InputNumber, Dropdown, Input, Pagination, message} from 'antd';
import {ArrowDownOutlined, BankOutlined} from '@ant-design/icons';
import "react-pullload/dist/ReactPullLoad.css";
import {formateDate} from "../../utils/dateUtils"
import logo from '../../assets/images/logo.jpg'
import './list.less'
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

export default class List extends Component {

  state = {
    allCategorys: [], // 所有分类列表
    categorys: [], // 一级分类列表
    products: [], // 所有商品列表
    activePromotions: [], // 所有正在进行的活动列表
    promotionProducts: [], // 所有参加活动的商品列表
    category: {}, // 当前一级分类
    subCategory: {}, // 当前二级分类
    value: '', // 搜索关键字
    productResults: [], // 搜索结果
    isSearch: false, // 是否是搜索
    priceOne: null, // 价格框1的值
    priceTwo: null, // 价格框2的值
    showProducts: [], // 实际显示的商品列表
    isPriceSearch: false, // 是否是价格搜索
    productIndexStart: 0, // 当前页商品起始下标
    productIndexEnd: 5, // 当前页商品结束下标
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
  searchProductsByName = async (value) => {
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
      window.location.reload(true)
    }
  }

  // 设置价格框1的值
  priceOneChange = (value) => {
    this.setState({
      priceOne: value,
    })
  }

  // 设置价格框2的值
  priceTwoChange = (value) => {
    this.setState({
      priceTwo: value,
    })
  }

  // 根据价格搜索商品
  searchProductsByPrice = async () => {
    let priceOne = this.state.priceOne
    let priceTwo = this.state.priceTwo
    console.log(priceOne, priceTwo)

    if (priceOne > priceTwo) {
      message.error('价格范围的最高价不能低于最低价')
    } else {
      let oldProducts = []
      if (this.state.isSearch) {
        oldProducts = this.state.productResults
      } else {
        let products = this.state.products
        let subCategory = this.state.subCategory
        for (let i = 0; i < products.length; i++) {
          if (products[i].fk_category_id === subCategory.pk_category_id) {
            oldProducts.push(products[i])
          }
        }
      }
      console.log(oldProducts)
      let newProducts = []
      if (priceOne === null && priceTwo === null) { // 如果两个框都为空结果不变
        newProducts = oldProducts
      } else if (priceOne !== null) { // 如果框1不为空
        if (priceTwo !== null) { // 如果框2不为空则2框皆不为空，判断2框值大小后取2数范围内值
          let small, big
          if (priceOne > priceTwo) {
            small = priceTwo
            big = priceOne
          } else {
            small = priceOne
            big = priceTwo
          }
          for (let i = 0; i < oldProducts.length; i++) {
            if ((oldProducts[i].price / 100) >= small && (oldProducts[i].price / 100) <= big) {
              newProducts.push(oldProducts[i])
            }
          }
        } else { // 如果框2为空则取大于框1的值
          for (let i = 0; i < oldProducts.length; i++) {
            if ((oldProducts[i].price / 100) >= priceOne) {
              newProducts.push(oldProducts[i])
            }
          }
        }
      } else if (priceTwo !== null) { // 如果框2不为空则取小于框2的值
        for (let i = 0; i < oldProducts.length; i++) {
          if ((oldProducts[i].price / 100) <= priceTwo) {
            newProducts.push(oldProducts[i])
          }
        }
      }
      console.log(newProducts)
      this.setState({
        showProducts: newProducts,
        isPriceSearch: true,
      })
    }

  }

  // 页码改变
  onPageChange = (pageNum) => {
    console.log(pageNum)

    this.setState({
      productIndexStart: (pageNum - 1) * 5,
      productIndexEnd: pageNum * 5,
    })
  }

  componentDidMount() {
    document.title = "商品列表"
    this.getAllCategorys()
    this.getCategorys(0)
    this.getProducts()
    this.getPromotions()
    this.getPromotionProducts()

    if (!this.props.location.state.isSearch) { // 如果不是搜索则是分类菜单跳转而来，获取选中的一级分类和二级分类
      const category = this.props.location.state.category
      const subCategory = this.props.location.state.subCategory
      const isSearch = this.props.location.state.isSearch
      console.log(category, subCategory, isSearch)
      this.setState({
        category: category,
        subCategory: subCategory,
        isSearch: isSearch,
      })
    } else { // 如果是搜索则获取搜索的关键字和搜索结果
      const value = this.props.location.state.value
      const productResults = this.props.location.state.productResults
      const isSearch = this.props.location.state.isSearch
      console.log(value, productResults, isSearch)
      this.setState({
        value: value,
        productResults: productResults,
        isSearch: isSearch,
      })
    }
  }

  render() {

    let {allCategorys, categorys, products, activePromotions, promotionProducts, category, subCategory, value, productResults, isSearch, showProducts, isPriceSearch, productIndexStart, productIndexEnd,} = this.state
    console.log(allCategorys, categorys, products, activePromotions, promotionProducts, category, subCategory, value, productResults, isSearch, showProducts, isPriceSearch, productIndexStart, productIndexEnd,)

    // 当前登录用户的用户名
    let username = ''
    if (cookieUtils.getUserCookie() !== undefined) {
      username = cookieUtils.getUserCookie()[0].username
      console.log(cookieUtils.getUserCookie())
    }

    if (isSearch && !isPriceSearch) { // 关键字搜索
      showProducts = productResults
    } else if (!isSearch && !isPriceSearch) { // 查看分类
      showProducts = []
      if (subCategory !== null) { // 二级分类
        for (let i = 0; i < products.length; i++) {
          if (products[i].fk_category_id === subCategory.pk_category_id) {
            showProducts.push(products[i])
          }
        }
      } else { // 一级分类
        // 获取当前一级分类其下的二级分类id数组
        let sonCategorys = []
        for (let i = 0; i < allCategorys.length; i++) {
          if (allCategorys[i].parent_category_id === category.pk_category_id) {
            sonCategorys.push(allCategorys[i].pk_category_id)
          }
        }
        console.log(sonCategorys)

        for (let i = 0; i < products.length; i++) {
          if (sonCategorys.indexOf(products[i].fk_category_id) !== -1) {
            showProducts.push(products[i])
          }
        }
        console.log(showProducts)
      }
    }
    console.log(showProducts)

    let productsNum = showProducts.length

    const menu = (
      <Menu>
        {
          categorys.map(category =>
            <SubMenu value={category.pk_category_id} key={category.pk_category_id} title={<span onClick={() => {
              let subCategory = null, isSearch = false
              this.props.history.replace('/list', {category, subCategory, isSearch})
              window.location.reload(true)
            }}>{category.name}</span>}>
              {allCategorys.map((subCategory) => subCategory.parent_category_id === category.pk_category_id ?
                <Menu.Item value={subCategory.pk_category_id}
                           key={subCategory.pk_category_id}>
                  <a onClick={() => {
                    let isSearch = false
                    this.props.history.replace('/list', {category, subCategory, isSearch})
                    window.location.reload(true)
                  }}>{subCategory.name}
                  </a>
                </Menu.Item> : null)}
            </SubMenu>)
        }
      </Menu>
    );

    return (
      <div className="container">
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
        <div className="header-box" style={{borderBottom: '2px solid red'}}>
          <div className="header">
            <div className="logo-box">
              <a onClick={() => {
                this.props.history.push('/home')
              }}>
                <img src={logo} alt="logo" style={{width: 190, height: 80}}/>
              </a>
              <div style={{
                width: 190,
                height: 30,
                backgroundColor: 'red',
                marginTop: 20,
                textAlign: 'center',
                color: 'white',
                paddingTop: 5
              }}>
                <Dropdown overlay={menu} placement='bottomCenter' overlayStyle={{width: 190}}>
                  <a onClick={e => e.preventDefault()} style={{color: 'white'}}>
                    全部商品分类
                  </a>
                </Dropdown>
              </div>
            </div>
            <div className="search-box">
              <div className="search-bar">
                <Search placeholder="请输入要搜索的商品名" enterButton onSearch={this.searchProductsByName}/>
                <div className="cart-btn"><span
                  className="iconfont iconfont-cart">&#xe63b;</span>&nbsp;&nbsp;&nbsp;&nbsp;我的购物车
                </div>
              </div>
              <ul style={{marginTop: 45, textAlign: 'center'}}>
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
        <div className="content" style={{backgroundColor: 'white'}}>
          <div className="wrapper">
            {isSearch ? '"' + value + '"的搜索结果' : (subCategory === null ?
              <a onClick={() => {
                let subCategory = null, isSearch = false
                this.props.history.replace('/list', {category, subCategory, isSearch})
                window.location.reload(true)
              }}>{category.name}
              </a> : (<span><a onClick={() => {
                let subCategory = null, isSearch = false
                this.props.history.replace('/list', {category, subCategory, isSearch})
                window.location.reload(true)
              }}>{category.name}</a><span>{'\n>\n' + subCategory.name}</span></span>))}
          </div>
          <div className="wrapper" style={{backgroundColor: '#F1F1F1'}}>
            <Radio.Group style={{marginLeft: 10}}>
              <Radio.Button value="small" style={{width: 70, height: 25, fontSize: 12}}>综合<ArrowDownOutlined
                style={{width: 7, height: 11}}/></Radio.Button>
              <Radio.Button value="small" style={{width: 70, height: 25, fontSize: 12}}>销量<ArrowDownOutlined
                style={{width: 7, height: 11}}/></Radio.Button>
              <Radio.Button value="small" style={{width: 80, height: 25, fontSize: 12}}>评论数<ArrowDownOutlined
                style={{width: 7, height: 11}}/></Radio.Button>
              <Radio.Button value="small" style={{width: 70, height: 25, fontSize: 12}}>新品<ArrowDownOutlined
                style={{width: 7, height: 11}}/></Radio.Button>
              <Radio.Button value="small" style={{width: 70, height: 25, fontSize: 12}}>价格<ArrowDownOutlined
                style={{width: 7, height: 11}}/></Radio.Button>
            </Radio.Group>
            &nbsp;&nbsp;&nbsp;
            <InputNumber min={0} style={{width: 60, height: 25}} placeholder="￥" onChange={this.priceOneChange}
                         onPressEnter={this.searchProductsByPrice}/>
            &nbsp;-&nbsp;
            <InputNumber min={0} style={{width: 60, height: 25}} placeholder="￥" onChange={this.priceTwoChange}
                         onPressEnter={this.searchProductsByPrice}/>
            <div style={{marginLeft: 400}}>共{productsNum}件商品</div>
            {products.length > 1 ?
              <Pagination simple defaultCurrent={1} defaultPageSize={5} total={productsNum} onChange={this.onPageChange}
                          style={{marginLeft: 10,}} showLessItems='true'/> : null}
          </div>
          <div className="wrapper" style={{backgroundColor: 'white'}}>
            <div className="content-box" style={{backgroundColor: 'white'}}>
              <ul style={{backgroundColor: 'white', minHeight: 600}}>
                {
                  showProducts.map((product, index) => (index >= productIndexStart && index < productIndexEnd) ?
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