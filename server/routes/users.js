var express = require('express');
var router = express.Router();
require('./../util/util')
var User = require('./../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 用户登录
router.post("/login",function(req, res, next){
	var param = {
		userName:req.body.userName
	};
	User.findOne(param, function(err,doc){
		if(err !== 'null'){
			if(doc){
				// 存储进去（用ip访问即可）
				res.cookie("userId",doc.userId,{
					path:'/',
					maxAge:1000*60*60
				})
				res.cookie("userName",doc.userName,{
					path:'/',
					maxAge:1000*60*60
				})
				//req.session.user = doc;
				if(doc.userPwd != req.body.userPwd){
					res.send({error: err});
          return;
				}else{
					res.json({
						status:'0',
						msg:'',
						result:{
							userName:doc.userName
						}
					})
				}
				
			}else{
				res.send({error: err});
	      return;
			}
		}
	})
})

// 退出登录
router.post("/logout", function(req, res, next){
	res.cookie("userId","",{
		path:"/",
		maxAge:-1
	})
	res.json({
		status:"0",
		msg:'',
		result:''
	})
})

// 检查是否在登录的状态
router.get("/checkLogin",function(req, res, next){
	// 判断这个
	if(req.cookies.userId){
		res.json({
			status:"0",
			msg:'',
			result:req.cookies.userName
		})
		console.log(result)
	}else{
		res.json({
			status:"1",
			msg:'未登录',
			result:''
		})
	}
})

// 查询用户购物车数据
router.get("/CartList", function(req, res, next){
	var userId = req.cookies.userId;
	User.findOne({userId:userId}, function(err,doc){
		if(err){
			res.json({
				status:"1",
				msg:err.message,
				result:''
			})
		}else{
			if(doc){
					res.json({
					status:"0",
					msg:"",
					result:doc.cartList
				})
			}
		}
	})
})

// 购物车删除
router.post("/cartdel",function(req, res, next){
	//console.log(100)
	var userId = req.cookies.userId,productId = req.body.productId;
	User.update({
		userId:userId
	},{
		$pull:{
			'cartList':{
				'productId':productId
				}
			}
		},function(err,doc){
			if(err){
				res.json({
					status:"1",
					msg:err.message,
					result:''
				})
			}else{
				if(doc){
						res.json({
						status:"0",
						msg:"",
						result:'suc'
					})
				}
			}
	})
	
})

// 修改商品的数量
router.post("/cartEdit",function(req, res, next){
	var userId = req.cookies.userId,productId = req.body.productId,productNum = req.body.productNum;
	User.update({'userId':userId,'cartList.productId':productId},{
		'cartList.$.productNum':productNum
	}, function(err,doc){
		if(err){
			res.json({
				status:"1",
				msg:err.message,
				result:''
			})
		}else{
			if(doc){
					res.json({
					status:"0",
					msg:"",
					result:'suc'
				})
			}
		}
	})
	
})

// 查询用户地址
router.get("/addressList",function(req, res, next){
	var userId = req.cookies.userId;
	User.findOne({userId:userId}, function(err,doc){
		if(err){
			res.json({
				status:"1",
				msg:err.message,
				result:''
			})
		}else{
			res.json({
				status:"0",
				msg:"",
				result:doc.addressList
			})
		}
	})
})

// 设置默认地址
router.post("/setDefault",function(req, res, next){
	var userId = req.cookies.userId,addressId = req.body.addressId;
	// 如果addressId没有传进来
	if(!addressId){
		res.json({
				status:"1003",
				msg:'addressId is null',
				result:''
			})
	}else{
		User.findOne({userId:userId},function(err,doc){
			if(err){
				res.json({
					status:"1",
					msg:err.message,
					result:''
				})
			}else{
				var addressList = doc.addressList;
				addressList.forEach((item) => {
					// 如果id相同
					if(item.addressId==addressId){
						item.isDefault = true
					}else{
						item.isDefault = false
					}
				})
				doc.save(function(err1,doc1){
					if(err){
						res.json({
							status:"1",
							msg:err.message,
							result:''
						})
					}else{
						res.json({
							status:"0",
							msg:"",
							result:""
						})
					}
				})
				
			}
		})
	}
})

// 删除地址功能
router.post("/delAddress",function(req, res, next){
	var userId = req.cookies.userId,addressId = req.body.addressId;
	User.update({
		userId:userId
	},{
		$pull:{
			'addressList':{
				'addressId':addressId
				}
			}
	},function(err,doc){
		if(err){
			res.json({
				status:"1",
				msg:err.message,
				result:''
			})
		}else{
			res.json({
				status:"0",
				msg:"",
				result:""
			})
		}
	})
	
})

// 生成支付订单
router.post("/payMent",function(req, res, next){
	var userId = req.cookies.userId,
			addressId = req.body.addressId,
			orderTotal = req.body.orderTotal;
	User.findOne({userId:userId},function(err,doc){
		if(err){
			res.json({
				status:"1",
				msg:err.message,
				result:''
			})
		}else{
			var address = '',goodList=[];
			// 获取当前用户地址信息
			doc.addressList.forEach((item) => {
				if(addressId==item.addressId){
					address = item
				}
			})
			// 获取用户购物车购买商品
			doc.cartList.filter((item) => {
				goodList.push(item)
			})
			
			// 平台的码
			var platform = '701'
			// 生成两个日期
			var r1 = Math.floor( Math.random()*10 );
			var r2 = Math.floor( Math.random()*10 );
			// 生成系统时间
			var sysDate = new Date().Format("yyyyMMddhhmmss");
			// 生成瞬间订单的时间
			var createDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
			// 订单的Id等于我的平台码+第一个随机数+系统时间——第二个随机数
			var orderId = platform + r1 + sysDate + r2
			
			// 生成订单
			var order = {
				orderId:orderId,
				orderTotal:orderTotal,
				addressInfo:address,
				goodList:goodList,
				orderStatus:'1',
				createDate:createDate
			}
			// 在订单列表里面放入这个订单信息
			doc.orderList.push(order);
			
			// 保存
			doc.save(function(err1,doc1){
				if(err1){
					res.json({
						status:"1",
						msg:err1.message,
						result:''
					})
				}else{
					res.json({
						status:"0",
						msg:"",
						result:{
							orderId:order.orderId,
							orderTotal:order.orderTotal
						}
					})
					console.log(order.orderTotal)
				}
			})
		}
	})
})

// 根据订单id查询订单信息
router.get("/orderDetail",function(req, res, next){
	var userId = req.cookies.userId,orderId = req.param("orderId");
	User.findOne({userId:userId},function(err,userInfo){
		if(err){
			res.json({
				status:"1",
				msg:err.message,
				result:''
			})
		}else{
			// 如果没有错误
			// 取用户的订单
			var orderList = userInfo.orderList;
			// 如果有订单
			if(orderList.length>0){
				var orderTotal = ''
				orderList.forEach((item)=>{
					if(item.orderId==orderId){
						orderTotal = item.orderTotal
					}
				})
				res.json({
					status:"0",
					msg:"",
					result:{
						orderId:orderId,
						orderTotal:orderTotal
					}
				})
			}else{
				// 如果没有
				res.json({
					status:"12001",
					msg:'无此订单',
					result:''
				})
			}
		}
	})
})

router.get("/getCartCount",function(req, res, next){
	if(req.cookies && req.cookies.userId){
		var userId = req.cookies.userId;
		User.findOne({userId:userId},function(err,doc){
			if(err){
				res.json({
					status:"1",
					msg:err.message,
					result:''
				})
			}else{
				var cartList = doc.cartList;
				let = cartCount = 0;
				// 数组映射，返回购物车加起来的值
				cartList.map(function(item){
					cartCount += parseInt(item.productNum) 
				})
				res.json({
					status:"0",
					msg:'',
					result:cartCount
				})
			}
		})
	}
})

module.exports = router;
