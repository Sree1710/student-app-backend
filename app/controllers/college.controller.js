const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const College = require("../models/college.model");
const { request, response } = require("express");
const multer = require("multer");
const path = require("path");
const Validator = require("../config/data.validate")

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (request, file, cb) => {
        cb(null, Date.now() + file.originalname.trim());
    },
});

const upload = multer({ storage: storage}).single('collegeImage');

exports.collegeCreate = (request, response) => {
    upload(request, response, function (err) {
        if (err) {
            console.error("Error uploading image:", err);
            return response.json({ "status": err });
        }
        const collegeToken = request.body.token;

        console.log(collegeToken)

        const { collegeName, collegeAddress, website, email, collegePhNo, collegeMobileNumber } = request.body;

        jwt.verify(collegeToken, "studentapp", (err, decoded) => {
            if (decoded) {

                const validationErrors = {};

                if (Validator.isEmpty(collegeName).isValid) {
                    validationErrors.name = Validator.isEmpty(collegeName).message;
                }
                if (!Validator.isValidName(collegeName).isValid) {
                    validationErrors.name = Validator.isValidName(collegeName).message;
                }
        
                if (!Validator.isValidAddress(collegeAddress).isValid) {
                    validationErrors.address = Validator.isValidAddress(collegeAddress).message;
                }
        
                if (!Validator.isValidWebsite(website).isValid) {
                    validationErrors.website = Validator.isValidWebsite(website).message;
                }
        
                if (!Validator.isValidEmail(email).isValid) {
                    validationErrors.email = Validator.isValidEmail(email).message;
                }
        
                if (!Validator.isValidPhoneNumber(collegePhNo).isValid) {
                    validationErrors.phone = Validator.isValidPhoneNumber(collegePhNo).message;
                }
        
                if (!Validator.isValidMobileNumber(collegeMobileNumber).isValid) {
                    validationErrors.mobile = Validator.isValidMobileNumber(collegeMobileNumber).message;
                }
        
                if (request.file && !Validator.isValidImageWith1mbConstratint(request.file).isValid) {
                    validationErrors.image = Validator.isValidImageWith1mbConstratint(request.file).message;
                }
        
                // If validation fails
                if (Object.keys(validationErrors).length > 0) {
                    return response.json({ "status": "Validation failed", "data": validationErrors });
                }


                const collegeImage = request.file ? request.file.filename : null;

                const college = new College({
                    collegeName: collegeName,
                    collegeAddress: collegeAddress,
                    website: website,
                    email: email,
                    collegePhNo: collegePhNo,
                    collegeMobileNumber: collegeMobileNumber,
                    collegeImage: collegeImage  // Set the collegeImage field with the filename
                });

                College.collegeCreate(college, (err, data) => {
                    if (err) {
                        return response.json({ "status": err });
                    } else {
                        return response.json({ "status": "success", "data": data });
                    }
                });
            } else {
                return response.json({ "status": "Unauthorized User!!" });
            }
        });


    });
};

