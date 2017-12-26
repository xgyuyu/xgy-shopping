var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var productSchema = new Schema({
	"productId":{typy:String},
	"productName":{typy:String},
	"salePrice":{typy:Number},
	"productImage":{typy:String},
	"productNum":{typy:Number},
	"checked":{typy:Number}
},{
	collection: 'goods'
});
module.exports = mongoose.model('Good',productSchema);
