var express = require('express');
var router =express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

// 连接数据库
mongoose.Promise = global.Promise;        //连接前加上这句话
mongoose.connect('mongodb://127.0.0.1:27017/xgymall');
// 成功
mongoose.connection.on("connected", function(){
	console.log("Success")
})
// 错误
mongoose.connection.on("error", function(){
	console.log("Error")
})
// 断开
mongoose.connection.on("disconnected", function(){
	console.log("Disconnected")
})

// 查询商品列表
router.get("/List", function(req,res,next){
	// 分页参数
	let page = parseInt(req.param("page"));
	let pageSize = parseInt(req.param("pageSize"));
	// 排序参数
	let sort = parseInt(req.param("sort"));
	// 分页公式
	let skip = (page-1)*pageSize;
	var pricedayu = '',pricexiaoyu = '';
	let priceLevel = req.param("priceLevel");
	let params = {};
	// 如果不是所有商品
	if(priceLevel!='all'){
		switch (priceLevel){
			case "0":pricedayu = 0;pricexiaoyu = 100;
				break;
			case "1":pricedayu = 100;pricexiaoyu = 500;
				break;
			case "2":pricedayu = 500;pricexiaoyu = 1000;
				break;
			case "3":pricedayu = 1000;pricexiaoyu = 5000;
				break;
		}
		params = {
			salePrice:{
				$gt:pricedayu,
				$lte:pricexiaoyu
			}
		}
	}
	// 创建模型
	// skip 是默认跳过几条数据
	let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
	// sort排序
	goodsModel.sort({'salePrice':sort});
	
	goodsModel.exec({}, function(err,result){
		if(err){
			res.json({
				status:'1',
				msg:err.message
			})
		}else{
			res.json({
				status:'0',
				msg:'',
				result:{
					count:result.length,
					list:result
				}
			})
		}
	})
})

// 加入到购物车
router.post("/addCart", function(req,res,next){
	var userId = '100000077',productId = req.body.productId;
	var User = require('../models/user');
	
	User.findOne({userId:userId}, function(err1,userDoc){
		if(err1){
			res.json({
				status:'1',
				msg:err1.message
			})
		}else{
			if(userDoc){
				let goodsItem = '';
				userDoc.cartList.forEach(function(item){
					if(item.productId == productId){
						goodsItem = item;
						item.productNum ++;
						console.log(item.productNum)
					}
				})
				if(goodsItem){
					userDoc.save(function(err3,doc2){
						if(err3){
							res.json({
								status:'1',
								msg:err3.message
							})
						}else{
							res.json({
								status:'0',
								msg:'',
								result:'suc'
							})
						}
					})
				}else{
					Goods.findOne({productId:productId}, function(err2,doc){
						if(err2){
							res.json({
								status:'1',
								msg:err2.message
							})
						}else{
							if(doc){
								// doc.productNum = 1;
								doc.checked = 1;
								userDoc.cartList.push(doc);
								userDoc.save(function(err3,doc2){
									if(err3){
										res.json({
											status:'1',
											msg:err3.message
										})
									}else{
										res.json({
											status:'0',
											msg:'',
											result:'suc'
										})
									}
								})
							}
						}
					})
				}
				
			}
		}
	})
})

module.exports = router;

