var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
	"userId": String,
	"userName":String,
	"userPwd":String,
	"orderList":Array,
	"cartList":[
		{
			"productId":String,
			"productName":String,
			"salePrice":Number,
			"productImage":String,
			"cheaked":String,
			"productNum":String
		}
	],
	"addressList":[
		{
			"addressId" : String,
			"userName" : String,
			"streetName" : String,
			"postCode" : Number,
			"tel" : Number,
			"isDefault" : Boolean
		}
		
	]
},{
	collection: 'users'
})

module.exports = mongoose.model('User',userSchema);
