const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phoneNo: {
        type: String,
        unique: true,
        // required: true
    },
    oldPhoneNo: [
        {
            type: String,
        },
    ],
    password: {
        type: String,
        // required: true
    },
    address: {
        addressl1: {
            type: String,
        },
        addressl2: {
            type: String,
        },
        village: {
            type: String,
        },
        district: {
            type: String,
        },
        state: {
            type: String,
        },
        pincode: {
            type: String,
        },
    },
    company: {
        companyName: {
            type: String,
        },
        companyPhoneNo: {
            type: String,
        },
        companyAddress: {
            type: String,
        },
        companyPanNo: {
            type: String,
        },
        companyIncorporationDate: {
            type: String,
        },
        companyIncorporationNumber: {
            type: String,
        },
        companyGstNo: {
            type: String,
        },
    },
    aadharNo: {
        type: String,
    },
    profileCompleted: {
        type: String,
    },
    phoneVerified: {
        type: String,
    },
    userType: {
        type: String,
    },
    signInUsing: {
        type: String,
    },
    result_mv: {
        type: Object,
    },
    lat: {
        type: String,
    },
    long: {
        type: String,
    },
    gstNo: {
        type: String,
    },
    companyRegNo: {
        type: String,
    },
    bankDetails: {
        accno: {
            type: String,
        },
        bname: {
            type: String,
        },
        ifsc: {
            type: String,
        },
        panNo: {
            type: String,
        },
        upId: {
            type: String,
        },
    },
    rDetails: {
        rname: {
            type: String,
        },
        remail: {
            type: String,
        },
        rphoneNo: {
            type: String,
        },
        rdesig: {
            type: String,
        },
    },
    uniqueCode: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: new Date(),
    },
    belongsTo: {
        type: String,
    },
    bresponse: {
        type: Object,
    },
    fcmToken: {
        type: String,
    },
    kycDone: {
        type: Boolean,
    },
    aadharUrl: {
        type: String,
    },
    panUrl: {
        type: String,
    },
    eAadhar: {
        type: String,
    },
    ePan: {
        type: String,
    },
    mswcCustId: {
        type: String,
    },
    registeredRef: {
        type: String,
    },
    signedInOnApp: {
        type: Boolean,
        default: true,
    },
    kycDocuments: [
        {
            url: String,
            name: String,
            timestamp: Date,
        },
    ],
    traderDocuments: [
        {
            file: Array,
            name: String,
            category: String,
            mandatory: Boolean,
            timestamp: Date,
            ref: String
        },
    ],
    whatsappOpted: {
        type: Boolean,
    },
});

// const User = (module.exports = mongoose.model('User', UserSchema));
const User = mongoose.model("Users", UserSchema, "users");
module.exports.User = User
module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

module.exports.getUserByphoneNo = function (phoneNo, callback) {
    const query = {
        phoneNo: phoneNo,
    };
    User.findOne(query, callback);
};

module.exports.getUserByEmail = function (email, callback) {
    const query = {
        email: email,
    };
    User.findOne(query, callback);
};

module.exports.addUser = async function (newUser, callback) {
    const salt = bcrypt.genSalt(10, (err, salt) => {
        console.log('err ', err);

        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
    User.findOne(salt, callback);
};

module.exports.newPassword = (newUser, callback) => {
    console.log('in add user ', newUser);
    bcrypt.genSalt(10, function (err, salt) {
        console.log('salt ', salt);
        console.log('pass ', newUser.password);
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            // Store hash in your password DB.
            if (err) throw err;
            newUser.password = hash;
            newUser.hashedPassword = hash;
            newUser.save(callback);
        });
    });
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};
