const { response } = require("express")
const db = require("../models/db")

const AdminStaff = function (adminStaff) {
    this.AdStaffName = adminStaff.AdStaffName
    this.PhNo = adminStaff.PhNo
    this.Address = adminStaff.Address
    this.AadharNo = adminStaff.AadharNo
    this.Email = adminStaff.Email
    this.Password = adminStaff.Password

}



AdminStaff.create = (newAdminStaff, result) => {
    
    db.query("SELECT * FROM admin_staff WHERE Email=?", newAdminStaff.Email, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        } else {
            if (res.length > 0) {
                console.log("Email already exists");
                result("Email already exists", null);
                return;
            } else {
                // Continue with the existing code for database insertion
                db.query("INSERT INTO admin_staff SET ?", newAdminStaff, (err, res) => {
                    console.log(newAdminStaff)
                    if (err) {
                        console.log("error: ", err)
                        result(err, null)
                        return
                    } else {
                        console.log("Added Admin Staff: ", { id: res.id, ...newAdminStaff })
                        result(null, { id: res.id, ...newAdminStaff })
                    }
                })
            }
        }
    })
};



module.exports = AdminStaff