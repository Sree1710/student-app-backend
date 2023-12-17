const express = require('express')
const router = express.Router()
const AdminController = require('../controllers/admin.controller')
const AdminStaffController=require('../controllers/adminStaff.controller')

router.post("/", AdminController.adminLogin)

router.post("/changepwd",AdminController.adminChangePwd)

router.post("/addadmstaff",AdminStaffController.create)





3







module.exports=router