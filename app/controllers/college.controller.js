const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const College = require("../models/college.model");
const { request, response } = require("express");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (request, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});

const fileFilter = function (req, file, cb) {
    // Accept only JPG and JPEG files
    const allowedExtensions = /\.(jpg|jpeg|png|webp|heif)$/;

    if (allowedExtensions.test(path.extname(file.originalname).toLowerCase())) {
        return cb(null, true);
    } else {
        return cb('Only JPG, JPEG, PNG, WEBP and HEIF files are allowed!', false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single('collegeImage');

exports.collegeCreate = (request, response) => {
    upload(request, response, function (err) {
        if (err) {
            console.error("Error uploading image:", err);
            return response.json({ "status": err });
        }

        const { collegeName, collegeAddress, website, email, collegePhNo, collegeMobileNumber } = request.body;
        const collegeToken = request.body.token;

        if (!collegeName || collegeName.trim() === "") {
            return response.json({ "status": "College name cannot be empty." });
        }

        if (!collegePhNo || !/^\d{2,4}\d{6,8}$/.test(collegePhNo)) {
            return response.json({ "status": "Invalid Phone Number" });
        }

        if (!collegeMobileNumber || !/^\+91[6-9][0-9]{9}$/.test(collegeMobileNumber)) {
            return response.json({ "status": "Invalid Mobile Number" });
        }

        if (!collegeAddress || collegeAddress.length > 100) {
            return response.json({ "status": "Address cannot be empty and should not exceed 100 characters" });
        }

        if (!website || !/^www\.[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/.test(website)) {
            return response.json({ "status": "Website must be in the format www.example.com" });
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return response.json({ "status": "Invalid Email" });
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
            }

            jwt.verify(collegeToken, "studentapp", (err, decoded) => {
                if (decoded) {
                    return response.json({ "status": "success", "data": data });
                } else {
                    return response.json({ "status": "Unauthorized User!!" });
                }
            });
        });
    });
};

