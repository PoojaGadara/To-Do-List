const catchAsync = require('../middleware/catchAsync')
const jwt = require('jsonwebtoken')
const {userModel }= require('../models/userModel');
const AppError = require('../utills/appError');

exports.auth = catchAsync(async(req,res,next) => {
    const { token}  = req.headers;

    if(!token){
        return next(new AppError("Please Login to access this Resource",401))
    }
    const decodeData = jwt.verify(token,process.env.SECRETKEY)

    req.user = await userModel.findById(decodeData.id)

    next();
})