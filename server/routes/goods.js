var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接mongodb数据库
mongoose.connect('mongodb://chen:chen@127.0.0.1:27017/db_demo');

mongoose.connection.on("connected",function(){
	console.log("MongoDB connected success");
});

mongoose.connection.on("disconnected",function(){
	console.log("MongoDB connected disconnected");
});

//查询商品列表数据
router.get('/',function(req,res,next){
	let page = parseInt(req.param("page"));
	let pageSize = parseInt(req.param("pageSize"));
	let priceLevel = req.param("priceLevel");
	let sort = req.param("sort");
	let params = {};
	let skip = (page-1)*pageSize;
	var priceGt = '',priceLte='';
	if(priceLevel!='all'){
		switch(priceLevel){
			case '0':priceGt=0;priceLte=100;break;
			case '1':priceGt=100;priceLte=500;break;
			case '2':priceGt=500;priceLte=1000;break;
			case '3':priceGt=1000;priceLte=5000;break;
		}
		params = {
			salePrice:{
				$gt:priceGt,//greater than 大于
				$lte:priceLte//less than or equal to 小于或等于
			}
		}
	}

	
	let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
	goodsModel.sort({'salePrice':sort});
	goodsModel.exec(function(err,doc){
		if(err){
			res.json({
				status:"1",
				msg:err.message
			});
		}else{
			res.json({
				status:'0',
				msg:'',
				result:{
					count:doc.length,
					list:doc
				}
			})
		}
	})
});

//加入到购物车
router.post("/addCart",function(req,res,next){
	var userId = '100000077';
	var User = require('../models/users');
	var productId = req.body.productId;
	
	User.findOne({userId:userId},function(err,userDoc){
		if(err){
			res.json({
				status:'1',
				msg:err.message
			});
		}else{
			// console.log("userDoc"+userDoc);
			// 遍历检查是否有相同的商品
			if(userDoc){
				let goodsItem = '';
				userDoc.cartList.forEach(function (item){
					if(item.productId ==productId){
						goodsItem = item;
						item.productNum++;
					}
				});
				// 有相同的则数量加1
				if(goodsItem){
					userDoc.save(function(err2,doc2){
						if(err2){
							console.log("err2");
							res.json({
								status:'1',
								msg:err2.message
							});
						}else{
							res.json({
								status:'0',
								msg:'',
								result:'success'
							})
						}
					})
				}else{
					Goods.findOne({productId:productId},function(err1,doc1){
						if(err1){
							res.json({
								status:'1',
								msg:err1.message
							});
						}else{
							if(doc1){
								doc1.productNum = 1;
								doc1.checked = 1;
								userDoc.cartList.push(doc1);
								userDoc.save(function(err2,doc2){
									if(err2){
										console.log("err2");
										res.json({
											status:'1',
											msg:err2.message
										});
									}else{
										res.json({
											status:'0',
											msg:'',
											result:'success'
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
});

module.exports = router;