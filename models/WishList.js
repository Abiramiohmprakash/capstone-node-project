var mongoose = require('mongoose');

var wishListdetailsSchema = mongoose.Schema({

	username:{
		type: String,
        required: false
	},
	email:{
       type: String,
       unique:false,
       required: true,
	},

    wishlisttext: {
        type: String,
        required: false
    },
    wishlistlink: {
        type: String,
        unique: false,
        required: false
    },
     wishlistcomment: {
        type: String,
        unique: false,
        required: false
    },
    wishlist_image: {
        type: String,
        unique: false,
        required: false
    }

});

var WishList = module.exports = mongoose.model('WishList', wishListdetailsSchema);


module.exports.createUser = function(newWishList, callback) {
        // create user
        newWishList.save(callback);
    }


