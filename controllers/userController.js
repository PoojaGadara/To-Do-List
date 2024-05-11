const catchAsync = require("../middleware/catchAsync");
const { userModel } = require("../models/userModel");
const sendToken = require('../utills/sendToken')

const register = catchAsync(async (req , res , next) => {

    try { 
          const {username,email,password} = req.body;
          const user = await userModel.create({
            username,
              email,
              password,
          });
          sendToken(user,201,res)
      } catch (error) {
        console.log(error)
        next(error)
      }
})

const login = catchAsync(async (req , res , next) => {
    const { email, password } = req.body;

    // checking if user has given password and email both
  
    if (!email || !password) {
      return next(new Errorhandler("Please Enter Email & Password", 400));
    }
  
    const user = await userModel.findOne({ email }).select("+password");
  
    console.log(user)

    if (!user) {
      return next(new Errorhandler("Invalid email or password", 401));
    }
  
    const isPasswordMatched = await user.comparePassword(password);

    console.log(isPasswordMatched)
  
    if (!isPasswordMatched) {
      return next(new Errorhandler("Invalid email or password", 401));
    }
  
    sendToken(user, 200, res);
    
})

const logout = catchAsync(async (req , res , next) => {

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })

    res.status(200).json({
        success :true,
        message:"Logged Out"
    });
    
})

module.exports = {
    register , 
    login,
    logout
}