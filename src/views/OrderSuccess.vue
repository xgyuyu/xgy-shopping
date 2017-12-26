<template>
    <div>
      <nav-header></nav-header>
		<div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li class="cur"><span>Make</span> payment</li>
            <li class="cur"><span>Order</span> confirmation</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>Congratulations! <br>Your order is under processing!</h3>
            <p>
              <span>Order ID：{{orderId}}</span>
              <span>Order total：{{orderTotal}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <a class="btn btn--m">Cart List</a>
              </div>
              <div class="btn-r-wrap">
                <a class="btn btn--m">Goods List</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav-footer></nav-footer> 
    </div>
</template>
<script>
	import NavHeader from '@/components/header'
	import NavFooter from '@/components/footer'
	import axios from 'axios'
    export default{
        data(){
            return{
            	orderId:'',
            	orderTotal:0
            }
        },
        mounted(){
        	var orderId = this.$route.query.orderId
        	// 如果订单id人为篡改了
        	if(!orderId){
        		return
        	}
        	axios.get("/users/orderDetail",{
        			params:{
        				orderId:orderId
        			}
        	}).then((response) => {
        		let res = response.data
        		console.log(res)
        		if(res.status=='0'){
        			this.orderId = orderId
        			this.orderTotal = res.result.orderTotal
        		}
        	})
        },
		components: {
			NavHeader,
			NavFooter
		}
    }
</script>
<style>
	@import url("../assets/css/base.css");
	@import url("../assets/css/product.css");
	@import url("../assets/css/login.css");
	@import url("../assets/css/checkout.css");
</style>