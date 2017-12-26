<template>
    <div>
		<nav-header></nav-header>
		<nav-bread>
			<span>goods</span>
		</nav-bread>
        <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" @click="sortGoods">Price <i v-html="Iprice">
            </i>
            </a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}" @click="setPriceAll">All</a></dd>
                <dd v-for="(price, index) in priceFilter">
                  <a href="javascript:void(0)" :class="{'cur':priceChecked==index}" @click="setPriceFilter(index)">{{price.startPrice}} - {{price.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item, index) in goodsList">
                    <div class="pic">
                      <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <!--滚动加载-->
                <div v-show="loading" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30" style="text-align: center;">
				  <img src="../../static/loading-svg/loading-spinning-bubbles.svg"/>
				</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
      <!-- 无法加入购物车模态框 -->
      <modal :mdshow="mdshow" @close="closeModal">
      	<p slot="message">
      		请先登录,否则无法加入购物车~
      	</p>
      	<div slot="btnGroup" style="width: 100%;">
      		<a href="javascript:;" class="btn btn--m" @click="mdshow=false">关闭</a>
      	</div>
      </modal>
      <!-- 加入购物车成功模态框 -->
      <modal :mdshow="mdshowCart">
      	<p slot="message">
      		<svg class="icon-status-ok">
	            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
	        </svg>
	        <span>加入购物车成功</span>
      	</p>
      	<div slot="btnGroup" @close="closeModal" style="width: 100%;">
      		<a href="javascript:;" class="btn btn--m" @click="mdshowCart=false" style="width: 48%;">继续购物</a>
      		<router-link href="javascript:;" class="btn btn--m" to="/Cart" style="width: 48%;">
      			查看购物车
      		</router-link>
      	</div>
      </modal>
      <nav-footer></nav-footer>
    </div>
</template>
<script>
	import NavHeader from '@/components/header'
	import NavFooter from '@/components/footer'
	import NavBread from '@/components/NavBread'
	import Modal from '@/components/Modal'
	import axios from 'axios'
    export default{
        data(){
            return {
            	// 获取的商品信息
            	goodsList: [],
            	// 默认是升序
            	sortFlag: true,
            	//价格的升降标志
            	Iprice: '&uarr;',
            	// 默认加载中会出现
            	loading: true,
            	// 默认是第一页
            	page: 1,
            	// 一页显示8个
            	pageSize: 8,
            	// 默认模态框是隐藏的
            	mdshow: false,
            	mdshowCart:false,
            	// 价格过滤
            	priceFilter: [
            		{
            			startPrice: '0.00',
            			endPrice: '100.00'
            		},
            		{
            			startPrice: '100.00',
            			endPrice: '500.00'
            		},
            		{
            			startPrice: '500.00',
            			endPrice: '1000.00'
            		},
            		{
            			startPrice: '1000.00',
            			endPrice: '5000.00'
            		}
            	],
            	priceChecked:'all',
            	// 价格过滤
            	filterBy: false,
            	// 遮罩
            	overLayFlag: false,
            	// 默认是禁用的
            	busy: true,
            	// 默认是不能点击加入购物车
            	clickShopping:false
            }
        },
        components: {
        	NavHeader,
        	NavFooter,
        	NavBread,
        	Modal
        },
        mounted: function() {
        	this.getGoodsList()
        },
        methods: {
        	// 获取json
        	getGoodsList(flag){
        		var param = {
        			page: this.page,
        			pageSize: this.pageSize,
        			// 排序的结果
        			sort: this.sortFlag?1:-1,
        			priceLevel: this.priceChecked
        		}
        		axios.get("/goods/List",{
        			// 参数需要加params
        			params:param
        		}).then((result) => {
        			let res = result.data
        			// 判断是否存在flag，存在的话为true
        			if(flag){
        				// 做数组连接
        				this.goodsList = this.goodsList.concat(res.result.list)
        				// 如果这个最后一次结果是为0
        				if(res.result.count==0){
        					// 那就禁用
        					this.busy = true
        					this.loading = false
        				}else{
        					// 否则开启
        					this.busy = false
        				}
        			}else{
        				// 不存在的话，那就直接获取对应的数组
        				this.goodsList = res.result.list
        				// 开启滚动加载
        				this.busy = false
        			}
        			
        			console.log(this.goodsList)
        		})
        	},
        	// 弹出价格
        	showFilterPop(){
        		this.filterBy = true
        		this.overLayFlag = true
        	},
        	closePop(){
        		this.filterBy = false
        		this.overLayFlag = false
        	},
        	// 选择价格后
        	setPriceFilter(index){
        		this.priceChecked = index
        		this.closePop()
        		this.page = 1
        		this.getGoodsList()
        	},
        	setPriceAll(){
        		this.priceChecked = 'all'
        		this.closePop()
        		this.page = 1
        		this.getGoodsList()
        	},
        	// 升序降序的点击
        	sortGoods(){
        		this.sortFlag = !this.sortFlag
        		this.page = 1
        		this.getGoodsList()
        		if(this.sortFlag){
        			this.Iprice = '&uarr;'
        		}else{
        			this.Iprice = '&darr;'
        		}
        	},
        	// 加载更多
        	loadMore(){
        		this.busy = true
        		setTimeout(() => {
        			this.page ++
			        this.getGoodsList(true)
			    }, 500);
        	},
        	addCart(productId){
    			axios.post("/goods/addCart",{
    			productId:productId
        		}).then((res)=>{
        			if(res.data.status == 0){
        				alert("加入成功")
        				this.mdshowCart = true
        				this.$store.commit("updateCartCount",1)
        			}else{
        				//console.log(res)
        				//alert("msg:"+res.data.msg+".添加失败")
        				console.log(res)
        				this.mdshow = true
        			}
        		})
        	},
        	// 关闭模态框
        	closeModal(){
        		this.mdshow = false
        		console.log(1)
        	}
        }
    }
</script>
<style type="text/css">
	@import url("../assets/css/base.css");
	@import url("../assets/css/product.css");
	@import url("../assets/css/login.css");
</style>