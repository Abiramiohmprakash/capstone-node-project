var mongoose = require('mongoose');

var serviceproviderdetailsSchema = mongoose.Schema({

    username: {
        type: String,
        unique: false,
        required: true
    },
    //    email: {
    //        type: String,
    //        unique: true,
    //        required: true,
    //        trim: true
    //    },
    //    category: {
    //        type: String,
    //        required: true
    //    },
    //    keywords: [{}],
    //    display_url: {
    //        type: String
    //    },
    //    image_url: {
    //        type: String,
    //        unique: false
    //    },
    zipcode: {
        type: String,
        unique: false
    }
    //    city: {
    //        type: String,
    //        unique: false
    //    },
    //    country: {
    //        type: String,
    //        unique: false
    //    },
    //    phonenum: {
    //        type: String,
    //        unique: false
    //    },
    //    address: {
    //        type: String,
    //        unique: false
    //    },
    //    isActive: {
    //        type: String,
    //        unique: false
    //    },
    //    doj: {
    //        type: Date,
    //        default: Date.now
    //    }

});

var Splist = mongoose.model('Splist', serviceproviderdetailsSchema);

module.exports = Splist;

//var SPLIST = module.exports = mongoose.model('SPLIST', serviceProviderDetailsSchema);
//
//module.exports.getUserByZipCode = function (zipcode, callback) {
//    var query = {
//        zipcode: zipcode
//    };
//    spList.findOne(query, callback);
//}
