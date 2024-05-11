const express = require('express')
const router = express.Router();
const {register , login , logout} = require('../controllers/userController')


//Register New User 
router.post('/new',register)

//login

router.post('/login',login)

//Logout

router.get('/logout',logout)


module.exports = router ; 