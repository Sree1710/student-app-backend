const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Admin = require("../models/admin.model");
const { request, response } = require("express");



exports.adminLogin = (request, response) => {
    const { userName, Password } = request.body

    const getUserName = request.body.userName
    const getPassword = request.body.Password

    Admin.findByUserName(userName, (err, admin) => {

        if (err) {
            if (err.kind === "not_found") {
                response.json({ "status": "Admin does not Exist." })
            } else {
                response.json({ "status": "Error retrieving Admin Details." })
            }
        } else {
            const passwordMatch = bcrypt.compareSync(Password, admin.Password)

            if (passwordMatch) {
                jwt.sign({ userName: getUserName, Password: getPassword }, "studentapp", { expiresIn: "1d" },
                    (error, token) => {
                        if (error) {
                            response.json({ "status": "Unauthorized User!!" })
                        } else {
                            response.json({ "status": "Success", "data": admin, "token": token })
                        }
                    })
            } else {
                response.json({ "status": "Invalid Username or Password !!!" })
            }

        }
    })
}

exports.adminChangePwd = (request, response) => {
    const { userName, oldPassword, newPassword, token } = request.body;

    Admin.changePassword({ userName, oldPassword, newPassword }, (err, result) => {
        if (err) {
            response.json({ status: err });
            return;
        }

        if (result.status === "Password Updated Successfully!!!") {
            
            const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

            
            Admin.changePassword({ userName, oldPassword, newPassword: hashedNewPassword }, (updateErr, updateResult) => {
                if (updateErr) {
                    response.json({ status: updateErr });
                    return;
                }

                
                jwt.verify(token, "studentapp", (error, decoded) => {
                    if (decoded) {
                        response.json({ status: "Password Successfully Updated!!!" });
                    } else {
                        response.json({ status: "Unauthorized User!!!" });
                    }
                });
            });
        } else {
            response.json(result);
        }
    });
};