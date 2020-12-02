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

module.exports = router;
