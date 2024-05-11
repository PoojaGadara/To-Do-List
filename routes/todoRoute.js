const express = require('express')
const router = express.Router();
const {createToDoList ,getToDoById, updateToDoById, deleteToDoById , listAllToDo ,uploadCsvFile, DownloadDataToCSV} = require('../controllers/todoController')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { auth }  = require('../middleware/auth')


//upload csv file 
router.post('/uploadcsv' ,  upload.single('csvFile') ,auth , uploadCsvFile)

//get All Do Do List
router.get('/list' ,listAllToDo)

//create todo list
router.post('/create',auth ,createToDoList)

//get todo by id
router.get('/:id',auth ,getToDoById)

//update todo list
router.put('/:id',auth ,updateToDoById)

//delete todo list 
router.delete('/:id',auth ,deleteToDoById)

//download csv file 
router.get('/download/:id',auth ,DownloadDataToCSV)



module.exports = router ; 