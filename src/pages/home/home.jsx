// 商城主页路由
import React, {Component} from 'react'
import logo from '../../assets/images/logo.jpg'
import image1 from '../../assets/images/1.jpg'
import image2 from '../../assets/images/2.jpg'
import image3 from '../../assets/images/3.jpg'
import image4 from '../../assets/images/4.jpg'
import image5 from '../../assets/images/5.png'
import './home.less'

export default class Home extends Component {

  state = {}

  componentDidMount() {
    document.title = "商城主页"
  }

  render() {

    return (
      <div className="container">
        <div className="nav">
          <div className="nav-box">
            <ul>
              <li><a href="#">你好，请登录&nbsp;&nbsp;</a><a href="#" style={{color: 'red'}}>免费注册</a></li>
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
              <a href="#">
                <img src={logo} alt="logo" style={{width: 190, height: 120}}/>
              </a>
            </div>
            <div className="search-box">
              <div className="search-bar">
                <input type="text" placeholder="请输入要搜索的商品名"/>
                <div className="search-btn"><span className="iconfont iconfont-search">&#xe63c;</span></div>
                <div className="cart-btn"><span
                  className="iconfont iconfont-cart">&#xe63b;</span>&nbsp;&nbsp;&nbsp;&nbsp;我的购物车
                </div>
              </div>
              <ul style={{marginTop: 40}}>
                <li><a href="#" style={{color: 'red', fontWeight: 'bold'}}>秒杀</a></li>
                <li><a href="#" style={{color: 'red', fontWeight: 'bold'}}>优惠券</a></li>
                <li><a href="#">PLUS会员</a></li>
                <li><a href="#">品牌闪购</a></li>
                <li><a href="#">拍卖</a></li>
                <li><a href="#">京东家电</a></li>
                <li><a href="#">京东超市</a></li>
                <li><a href="#">京东生鲜</a></li>
                <li><a href="#">京东国际</a></li>
                <li><a href="#">京东金融</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="wrapper">
            <div className="menu-box" id="menu">
              <ul>
                <li>
                  <div className="main-menu">
                    <a href="#">家用电器</a>
                  </div>
                  <div className="sub-menu clearfix">
                    <div className="left-box">
                      <dl>
                        <dd>
                          <a href="#">电视</a>
                          <a href="#">空调</a>
                          <a href="#">洗衣机</a>
                          <a href="#">冰箱</a>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="main-menu">
                    <a href="#">手机</a>
                  </div>
                  <div className="sub-menu clearfix">
                    <div className="left-box">
                      <dl>
                        <dd>
                          <a href="#">游戏手机</a>
                          <a href="#">5G手机</a>
                          <a href="#">全面屏手机</a>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="main-menu">
                    <a href="#">电脑</a>
                  </div>
                  <div className="sub-menu clearfix">
                    <div className="left-box">
                      <dl>
                        <dd>
                          <a href="#">笔记本电脑</a>
                          <a href="#">平板电脑</a>
                          <a href="#">台式机</a>
                          <a href="#">一体机</a>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="slider-box">
              <div className="slider" id="slider">
                <ul className="clearfix">
                  <li>
                    <img src={image1} style={{width: 780, height: 470}}/>
                  </li>
                  <li>
                    <img src={image2} style={{width: 780, height: 470}}/>
                  </li>
                  <li>
                    <img src={image3} style={{width: 780, height: 470}}/>
                  </li>
                  <li>
                    <img src={image4} style={{width: 780, height: 470}}/>
                  </li>
                </ul>
                <div className="left-box">
                  <span>&lt;</span>
                </div>
                <div className="right-box">
                  <span>&gt;</span>
                </div>
                <div className="index-box">
                  <ol>
                  </ol>
                </div>
              </div>
            </div>
            <div className="new-box">
              <div className="user-info">
                <p>Hi~欢迎逛京东！</p>
                <a href="#">登录</a>
                <span style={{color: '#999'}}>&nbsp;|&nbsp;</span>
                <a href="#">注册</a>
              </div>
            </div>
          </div>
          <div style={{height: 300, width: 1190, margin: 'auto'}}>
            <div style={{height: 300, width: 590, margin: 'auto', float: 'left', backgroundColor: 'white'}}>
              <div style={{fontSize: 24, fontWeight: 'bold', marginTop: 10, marginLeft: 20}}>每日特价</div>
              <div className="promotion-products">
                <ul>
                  <li>
                    <a href="#">
                      <div className="pic-box">
                        <img src={image5} style={{width: 100, height: 100}}/>
                      </div>
                      <div className="name"><i>自营</i>俏侬 法式酥皮 760g 16片装 烘焙食材烘焙半成品 烤箱烘焙 冷冻
                      </div>
                      <div className="price"><i>¥</i>25.00</div>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <div className="pic-box">
                        <img src={image5} style={{width: 100, height: 100}}/>
                      </div>
                      <div className="name"><i>自营</i>俏侬 法式酥皮 760g 16片装 烘焙食材烘焙半成品 烤箱烘焙 冷冻
                      </div>
                      <div className="price"><i>¥</i>25.00</div>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <div className="pic-box">
                        <img src={image5} style={{width: 100, height: 100}}/>
                      </div>
                      <div className="name"><i>自营</i>俏侬 法式酥皮 760g 16片装 烘焙食材烘焙半成品 烤箱烘焙 冷冻
                      </div>
                      <div className="price"><i>¥</i>25.00</div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div style={{height: 300, width: 590, margin: 'auto', float: 'right', backgroundColor: 'white'}}>
              <div style={{fontSize: 24, fontWeight: 'bold', marginTop: 10, marginLeft: 20}}>品牌闪购</div>
              <div className="promotion-products">
                <ul>
                  <li>
                    <a href="#">
                      <div className="pic-box">
                        <img src={image5} style={{width: 100, height: 100}}/>
                      </div>
                      <div className="name"><i>自营</i>俏侬 法式酥皮 760g 16片装 烘焙食材烘焙半成品 烤箱烘焙 冷冻
                      </div>
                      <div className="price"><i>¥</i>25.00</div>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <div className="pic-box">
                        <img src={image5} style={{width: 100, height: 100}}/>
                      </div>
                      <div className="name"><i>自营</i>俏侬 法式酥皮 760g 16片装 烘焙食材烘焙半成品 烤箱烘焙 冷冻
                      </div>
                      <div className="price"><i>¥</i>25.00</div>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <div className="pic-box">
                        <img src={image5} style={{width: 100, height: 100}}/>
                      </div>
                      <div className="name"><i>自营</i>俏侬 法式酥皮 760g 16片装 烘焙食材烘焙半成品 烤箱烘焙 冷冻
                      </div>
                      <div className="price"><i>¥</i>25.00</div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="wrapper direction">
            <div className="content-box">
              <ul>
                <li>
                  <a href="#">
                    <div className="pic-box">
                      <img src={image5} style={{width: 150, height: 150}}/>
                    </div>
                    <div className="name"><i>自营</i>俏侬 法式酥皮 760g 16片装 烘焙食材烘焙半成品 烤箱烘焙 冷冻
                    </div>
                    <div className="price"><i>¥</i>25.00</div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <div className="pic-box">
                      <img src={image5} style={{width: 150, height: 150}}/>
                    </div>
                    <div className="name"><i>自营</i>俏侬 法式酥皮 760g 16片装 烘焙食材烘焙半成品 烤箱烘焙 冷冻
                    </div>
                    <div className="price"><i>¥</i>25.00</div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <div className="pic-box">
                      <img src={image5} style={{width: 150, height: 150}}/>
                    </div>
                    <div className="name"><i>自营</i>俏侬 法式酥皮 760g 16片装 烘焙食材烘焙半成品 烤箱烘焙 冷冻
                    </div>
                    <div className="price"><i>¥</i>25.00</div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <div className="pic-box">
                      <img src={image5} style={{width: 150, height: 150}}/>
                    </div>
                    <div className="name"><i>自营</i>俏侬 法式酥皮 760g 16片装 烘焙食材烘焙半成品 烤箱烘焙 冷冻
                    </div>
                    <div className="price"><i>¥</i>25.00</div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <div className="pic-box">
                      <img src={image5} style={{width: 150, height: 150}}/>
                    </div>
                    <div className="name"><i>自营</i>俏侬 法式酥皮 760g 16片装 烘焙食材烘焙半成品 烤箱烘焙 冷冻
                    </div>
                    <div className="price"><i>¥</i>25.00</div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <div className="pic-box">
                      <img src={image5} style={{width: 150, height: 150}}/>
                    </div>
                    <div className="name"><i>自营</i>俏侬 法式酥皮 760g 16片装 烘焙食材烘焙半成品 烤箱烘焙 冷冻
                    </div>
                    <div className="price"><i>¥</i>25.00</div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <div className="pic-box">
                      <img src={image5} style={{width: 150, height: 150}}/>
                    </div>
                    <div className="name"><i>自营</i>俏侬 法式酥皮 760g 16片装 烘焙食材烘焙半成品 烤箱烘焙 冷冻
                    </div>
                    <div className="price"><i>¥</i>25.00</div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <div className="pic-box">
                      <img src={image5} style={{width: 150, height: 150}}/>
                    </div>
                    <div className="name"><i>自营</i>俏侬 法式酥皮 760g 16片装 烘焙食材烘焙半成品 烤箱烘焙 冷冻
                    </div>
                    <div className="price"><i>¥</i>25.00</div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <div className="pic-box">
                      <img src={image5} style={{width: 150, height: 150}}/>
                    </div>
                    <div className="name"><i>自营</i>俏侬 法式酥皮 760g 16片装 烘焙食材烘焙半成品 烤箱烘焙 冷冻
                    </div>
                    <div className="price"><i>¥</i>25.00</div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <div className="pic-box">
                      <img src={image5} style={{width: 150, height: 150}}/>
                    </div>
                    <div className="name"><i>自营</i>俏侬 法式酥皮 760g 16片装 烘焙食材烘焙半成品 烤箱烘焙 冷冻
                    </div>
                    <div className="price"><i>¥</i>25.00</div>
                  </a>
                </li>
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