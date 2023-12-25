const { request, response } = require("express");
const db = require("../models/db");
const Student = require("../models/student.model");
const multer = require('multer');
const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const fileNameWithoutSpaces = Date.now() + file.originalname.replace(/\s/g, '');
        cb(null, fileNameWithoutSpaces);
    },
});

const upload = multer({ storage: storage }).single('studProfilePic');

exports.createStudent = (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            console.error("Error uploading image:", err);
            return res.json({ "status": err });
        }

        const { collegeId, batchId, studName, admNo, rollNo, studDept, course, studEmail, studPhNo, aadharNo, password } = req.body;

        const saltRounds = 10;

        const studProfilePic = req.file? req.file.filename : null 

        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                return res.json({ "status": err });
            }

            const newStudent = new Student({
                collegeId: collegeId,
                batchId: batchId,
                studName: studName,
                admNo: admNo,
                rollNo: rollNo,
                studDept: studDept,
                course: course,
                studEmail: studEmail,
                studPhNo: studPhNo,
                studProfilePic: studProfilePic,
                aadharNo: aadharNo,
                password: hashedPassword
            });

            Student.create(newStudent, (err, data) => {
                if (err) {
                    return res.json({ "status": err });
                } else {
                    return res.json({ "status": "success", "data": data });
                }
            });
        });
    });
};

