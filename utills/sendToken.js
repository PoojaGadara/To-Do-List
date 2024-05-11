
const sendToken=  (user,statuscode,res) => {

    console.log(user , statuscode , res)
    const token =  user.getJWTToken()

    const options = {
        expires: new Date('9999-12-31T23:59:59Z'), // Set to a date far in the future
        httpOnly : true,
    }
    res.status(statuscode).cookie('token',token,options).json({
        success:true,
        user,
        token
    })

}

module.exports = sendToken