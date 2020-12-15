const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
	"userId":String,
	"userName":String,
	"userPwd":String,
	"orderList":Array,
	"cartList":[
		{
			"productId":String,
			"productName":String,
			"salePrice":Number,
			"productImage":String,
			"checked":String,
			"productNum":Number
		}
	],
	"addressList":[
	{
		"addressId":String,
		"userName":String,
		"streetName":String,
		"postCode":Number,
		"tel":Number,
		"isDefault":Boolean
	}
	]
});

module.exports = mongoose.model("User",userSchema,"users");
//"User"模型的名称,userSchema 模型值,"users"数据库集合 默认 模型名+s