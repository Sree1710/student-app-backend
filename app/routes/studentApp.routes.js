const express = require('express')
const router = express.Router()
const AdminController = require('../controllers/admin.controller')
const AdminStaffController=require('../controllers/adminStaff.controller')
const CollegeController=require("../controllers/college.controller")
const BatchesCollector=require('../controllers/batches.controller')
const TaskController=require('../controllers/task.controller')

router.post("/", AdminController.adminLogin)

router.post("/changepwd",AdminController.adminChangePwd)

router.post("/addadmstaff",AdminStaffController.create)

router.post("/addclg",CollegeController.collegeCreate)

router.post("/addbatches",BatchesCollector.batchCreate)

router.post("/addtask",TaskController.createTask)

router.post("/updatetask",TaskController.taskUpdate)




module.exports=router