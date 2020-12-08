const express = require('express');
const router = express.Router();

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

module.exports = router;
