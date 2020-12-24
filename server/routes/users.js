const express = require('express');
const router = express.Router();
// 加载工具类 util(获取时间工具) module export导出，用require
require('./../util/util');
const User = require('./../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 用户登陆路由逻辑，获取输入的用户ID,密码，并通过Mogoose查询，返回结果
router.post("/login",function(req,res,next){
	var param={
		userName:req.body.userName,
		userPwd:req.body.userPwd
	}
	User.findOne(param,function(err,doc){
		if(err){
			res.json({
				status:'1',
				msg:err.message
			});
		}else{
			if(doc){
				res.cookie("userId",doc.userId,{
					path:"/",
					maxAge:1000*60*60
				});
				res.cookie("userName",doc.userName,{
					path:"/",
					maxAge:1000*60*60
				});
				// req.session.user=doc;
				res.json({
					status:'0',
					msg:'',
					result:{
						userName:doc.userName
					}
				});
			}	
		}
	});
});

// 登出接口

router.post("/logout",function(req,res,next){
	res.cookie("userId","",{
		path:"/",
		maxAge:-1
	});
	res.json({
		status:'0',
		msg:'',
		result:''
	});
})

// 登陆检查接口,当前用户是否已经登陆
router.get("/checkLogin",function(req,res,next){
	if(req.cookies.userId){
		res.json({
			status:'0',
			msg:'',
			result:req.cookies.userName 
		});
	}else{
		res.json({
			status:'1',
			msg:'未登录',
			result:''
		});
	}
})

// 查询当前用户的购物车数据
router.get("/cartList",function(req,res,next){
	var userId = req.cookies.userId;
	User.findOne({userId:userId},function(err,doc){
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		}else{
			if(doc){
				res.json({
					status:'0',
					msg:'',
					result:doc.cartList
				});
			}
		}
	})
});


// 购物车删除
router.post("/cartDel",function(req,res,next){
	var userId = req.cookies.userId,productId = req.body.productId;
	User.update({
		userId:userId
	},{
		// $pull 可以删除子文档 cartList
		$pull:{
			'cartList':{
				'productId':productId
			}
		}
	},function (err,doc){
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		}else{
			res.json({
				status:'0',
				msg:'',
				result:'suc'
			});
		}
	});
});

// 购物车修改商品数量、选中状态
router.post("/cartEdit",function(req,res,next){
	var userId = req.cookies.userId;
	var productId = req.body.productId;
	var productNum = req.body.productNum;
	var checked = req.body.checked;
	User.update({"userId":userId,"cartList.productId":productId},{
		"cartList.$.productNum":productNum,
		"cartList.$.checked":checked,
	},function(err,doc){
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		}else{
			res.json({
				status:'0',
				msg:'',
				result:'suc'
			});
		}
	});
});

// 购物车全选
router.post("/editCheckAll",function(req,res,next){
	var userId = req.cookies.userId;
	var checkAll = req.body.checkAll?'1':'0';
	User.findOne({userId:userId},function(err,user){
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		}else{
			if(user){
				user.cartList.forEach((item)=>{
					item.checked = checkAll;
				});
				user.save(function(err1,doc){
					if(err1){
						res.json({
							status:'1',
							msg:err1.message,
							result:''
						});
					}else{
						res.json({
							status:'0',
							msg:'',
							result:'suc'
						});
					}
				});
			}
		}
	});
});

// 查询用户地址
router.get("/addressList",(req,res,next)=>{
	var userId = req.cookies.userId;
	User.findOne({userId:userId},function(err,doc){
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		}else{
			res.json({
				status:'0',
				msg:'',
				result:doc.addressList
			});
		}
	});
});

// 设置默认地址
router.post("/setDefault",function(req,res,next){
	var userId = req.cookies.userId;
	var addressId = req.body.addressId;
	if(!addressId){
		res.json({
			status:'1003',
			msg:"address is null",
			result:''
		});
	}
	User.findOne({userId:userId},function(err,doc){
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		}else{
			var addressList = doc.addressList;
			addressList.forEach((item)=>{
				if(item.addressId==addressId){
					item.isDefault = true;
				}else{
					item.isDefault = false;
				}
			});
			
			doc.save(function(err1,doc1){
				if(err){
					res.json({
						status:'1',
						msg:err.message,
						result:''
					});
				}else{
					res.json({
						status:'0',
						msg:'',
						result:''
					});
				}
			});
		}
	});
});

// 删除地址接口

router.post("/delAddress",function(req,res,next){
	var userId = req.cookies.userId;
	var addressId = req.body.addressId;
	User.update({
		userId:userId
	},{
		// $pull 可以删除子文档 addressList
		$pull:{
			'addressList':{
				'addressId':addressId
			}
		}
	},function (err,doc){
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		}else{
			res.json({
				status:'0',
				msg:'',
				result:''
			});
		}
	});
});

// 生成订单
router.post("/payMent",function(req,res,next){
	var userId = req.cookies.userId;
	var orderTotal = req.body.orderTotal;
	var addressId = req.body.addressId;
	
	User.findOne({userId:userId},function(err,doc){
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		}else{
			// 获取提交购物单上的地址信息
			var address='';
			doc.addressList.forEach((item)=>{
				if(item.addressId==addressId){
					address=item;
				}
			});
			// 获取购物单上的商品信息
			// filter 遍历
			var goodsList=[];
			doc.cartList.filter((item)=>{
				if(item.checked=='1'){
					goodsList.push(item);
				}
			});
			
			// 订单id的随机生成和创建订单时间
			// 该订单ID可能相同（不够安全）
			
			// 随机数 Math.random()*10 随机一个0<=x<10数字
			// Math.floor() 向下取整
			var r1 = Math.floor(Math.random()*10);
			var r2 = Math.floor(Math.random()*10);
			// platform 是平台码，用于方便拼接
			var platform = '662';
			
			// 通过工具类提供的 Format 获取系统时间
			var sysDate = new Date().Format('yyyyMMddhhmmss');
			var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
			var orderId = platform+r1+sysDate+r2;
			// 创建订单
			var order = {
				orderId:orderId,
				orderTotal:orderTotal,
				addressInfo:address,
				goodsList:goodsList,
				orderStatus:'1',
				createDate:createDate
			};
			
			doc.orderList.push(order);
			
			doc.save(function(err1,doc1){
				if(err1){
					res.json({
						status:'1',
						msg:err.message,
						result:''
					});
				}else{
					res.json({
						status:'0',
						msg:'',
						result:{
							orderId:order.orderId,
							orderTotal:order.orderTotal	
						}
					});
				}
			});
		}
	});
});

// 根据订单Id查询订单信息
router.get("/orderDetail",function(req,res,next){
	var userId = req.cookies.userId;
	var orderId = req.param("orderId");
	User.findOne({userId:userId},function(err,userInfo){
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		}else{
			// 遍历用户的订单，根据orderId选出结算的订单
			var orderList = userInfo.orderList;
			if(orderList.length>0){
				var orderTotal = 0;
				orderList.forEach((item)=>{
					if(item.orderId == orderId){
						orderTotal = item.orderTotal;
					}
				});
				// 判断订单是否存在 根据结算总金额判断
				if(orderTotal>0){
					res.json({
						status:'0',
						msg:'',
						result:{
							orderId:orderId,
							orderTotal:orderTotal
						}
					});
				}else{
					res.json({
						status:'12002',
						msg:'无此订单',
						result:''
					});
				}
			// 遍历后 所有订单ID均不符合要求 则返回报错
			}else{
				res.json({
					status:'12001',
					msg:'当前用户无此订单',
					result:''
				});
			}
		}
	});
})

module.exports = router;
