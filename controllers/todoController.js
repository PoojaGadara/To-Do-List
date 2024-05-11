const { todoItemModel } = require('../models/toDoItemModel')
const AppError = require('../utills/appError')
const catchAsync = require('../middleware/catchAsync')
const ApiFeatures = require('../utills/apiFeatures')
const xlsx = require('xlsx')

const uploadCsvFile = catchAsync(async (req, res, next) => {
    try {
        const wb = xlsx.readFile(req.file.path);

        // Loop through all sheet names using for...of loop
        for (const sheetName of wb.SheetNames) {
            const sheet = wb.Sheets[sheetName];

            // Convert sheet data to JSON
            const data = xlsx.utils.sheet_to_json(sheet);

            if (data.length === 0) {
                return next(new AppError('No Data Found in CSV File', 400));
            }

            // Map data to required format
            const fullData = data.map((row) => ({
                taskDescription: row.taskDescription,
                statusFlag: row.statusFlag,
                priority: row.priority
            }));

            // Save data to the database
            const dataSaved = await todoItemModel.create(fullData);

            if (!dataSaved) {
                return next(new AppError('Error In Data Saving To Database', 400));
            }

            res.status(200).json({
                success: true,
                message: "Data Saved Successfully",
                Data: dataSaved
            })
        }
    } catch (error) {
        next(error);
    }
});

const listAllToDo = catchAsync(async (req, res, next) => {

    console.log(req.query)
    const apiFeatuer = new ApiFeatures(todoItemModel.find({}), req.query)
        .search()
        .filter()

    let todo = await apiFeatuer.query;

    if (!todo) {
        return next(new AppError('No Todo Lists is Found', 404));
    }

    res.status(200).json({
        success: true,
        Todo: todo
    })
})


const createToDoList = catchAsync(async (req, res, next) => {
    const { taskDescription, statusFlag, dueDate, priority } = req.body;

    try {
        const todo = await todoItemModel.create({
            taskDescription,
            statusFlag,
            dueDate,
            priority
        });

        if (!todo) {
            return next(new AppError('Error While Creating Todo List', 404));
        }

        res.status(200).send({
            success: true,
            message: "List Created Successfully",
            Data: todo
        });

    } catch (error) {
        throw error
    }
})

const getToDoById = catchAsync(async (req, res, next) => {
    try {
        const { id } = req.params;

        const toDo = await todoItemModel.findById(id)

        if (!toDo) {
            throw next(new AppError('Data not Found'))
        }

        res.status(200).send({
            success: true,
            Data: toDo,
        });

    } catch (error) {
        throw error
    }

})

const deleteToDoById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const toDo = await todoItemModel.findByIdAndDelete(id);

        if (!toDo) {
            return next(new AppError('Data not Found'));
        }

        res.status(200).json({
            success: true,
            message: 'ToDo item deleted successfully',
            data: toDo
        });
    } catch (error) {
        next(error); 
    }
}


const updateToDoById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { taskDescription, statusFlag, dueDate, priority } = req.body;
        
        const newData = {
            taskDescription: taskDescription,
            statusFlag: statusFlag,
            dueDate: dueDate,
            priority: priority,
            modifiedAt: Date.now()
        };

        const todo = await todoItemModel.findByIdAndUpdate(id, newData, { new: true });

        if (!todo) {
            return next(new AppError('Data not Found'));
        }

        res.status(200).send({
            success: true,
            message: 'ToDo item Updated successfully',
            data: todo
        });

    } catch (error) {
        throw error
    }
}

const DownloadDataToCSV = catchAsync(async (req, res, next) => {
    try {
        const { id } = req.params;
        // Query the database to retrieve the todo list data
        const todo = await todoItemModel.findById(id);

        if (!todo) {
            return next(new AppError('Data not Found'));
        }

        // Create a new workbook
        const wb = xlsx.utils.book_new();

        // Convert todo list data to worksheet
        const ws = xlsx.utils.json_to_sheet([todo]);

        // Add worksheet to workbook
        xlsx.utils.book_append_sheet(wb, ws, 'Todo List');

        // Write workbook to a buffer
        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        // Set headers to trigger file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="todo_list.xlsx"');

        // Send the Excel file buffer in the response
        res.send(buffer);
    } catch (error) {
        next(error);
    }
})



module.exports = {
    createToDoList,
    getToDoById,
    deleteToDoById,
    updateToDoById,
    listAllToDo,
    uploadCsvFile,
    DownloadDataToCSV
}