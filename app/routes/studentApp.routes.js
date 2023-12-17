const express = require('express')
const router = express.Router()
const AdminController = require('../controllers/admin.controller')
const AdminStaffController=require('../controllers/adminStaff.controller')
const CollegeController=require("../controllers/college.controller")

router.post("/", AdminController.adminLogin)

router.post("/changepwd",AdminController.adminChangePwd)

router.post("/addadmstaff",AdminStaffController.create)

router.post("/addclg",CollegeController.collegeCreate)









module.exports=router