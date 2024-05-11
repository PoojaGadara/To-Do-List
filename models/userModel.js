const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const userSchema = new mongoose.Schema({

    username: {
        type:String,
        required:[true,'Please Enter Name'],
        maxLength:[30,'Name can not excced 30 characters'],
        minLength:[4,'Name Must have more than 4 Characters']
    },
    email: {
        type:String,
        required:[true,'Please Enter Email'],
        unique:true,
        validate:[validator.isEmail,'Please Enter Validate Email Address']
    },
    password: {
        type:String,
        required:[true,'Please Enter Password'],
        minLength:[8,'Password should not less than 8 Characters'],
        select:false,
    },
    created: {
        type: Date,
        default : Date.now()
    },
    modifiedAt :{
        type : Date
    }
});

userSchema.pre("save",async function(next) {
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
});

//JWT Token
userSchema.methods.getJWTToken = function (){
    return jwt.sign({id:this._id},process.env.SECRETKEY,{
        expiresIn : process.env.JWT_EXPIER
    });
}
//comapre Password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

const userModel = mongoose.model('user', userSchema);


module.exports = {
    userModel
}