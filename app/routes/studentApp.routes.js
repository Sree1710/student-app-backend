const express = require('express')
const router = express.Router()
const AdminController = require('../controllers/admin.controller')
const AdminStaffController=require('../controllers/adminStaff.controller')
const CollegeController=require("../controllers/college.controller")
const BatchesCollector=require('../controllers/batches.controller')

router.post("/", AdminController.adminLogin)

router.post("/changepwd",AdminController.adminChangePwd)

router.post("/addadmstaff",AdminStaffController.create)

router.post("/addclg",CollegeController.collegeCreate)

router.post("/addbatches",BatchesCollector.batchCreate)







module.exports=router