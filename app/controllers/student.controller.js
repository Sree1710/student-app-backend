const { request, response } = require("express");
const StudentModel = require("../models/student.model");
const PaymentModel = require("../models/payment.model");
const multer = require('multer');
const bcrypt = require('bcrypt');
const Validator = require("../config/data.validate");

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

        const { collegeId, batchId, studName, admNo, rollNo, studDept, course, studEmail, studPhNo, aadharNo, password, rpPaymentId, rpOrderId, rpAmount } = req.body;

        const saltRounds = 10;

        const studProfilePic = req.file ? req.file.filename : null;

        // Validation
        const validationErrors = {};

        // ... (rest of the validation code)

        // If validation fails
        if (Object.keys(validationErrors).length > 0) {
            return res.json({ "status": "Validation failed", "data": validationErrors });
        }

        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                return res.json({ "status": err });
            }

            const newStudent = new StudentModel({
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

            StudentModel.create(newStudent, (err, data) => {
                if (err) {
                    return res.json({ "status": err });
                } else {
                    // Payment creation logic can be added here
                    const newPayment = new PaymentModel({
                        studId: data.id, // Assuming 'id' is the student's ID
                        rpPaymentId: rpPaymentId,
                        rpOrderId: rpOrderId,
                        rpAmount: rpAmount
                    });

                    PaymentModel.create(newPayment, (paymentErr, paymentData) => {
                        if (paymentErr) {
                            return res.json({ "status": paymentErr });
                        } else {
                            return res.json({ "status": "success", "data": data, "paymentData": paymentData });
                        }
                    });
                }
            });
        });
    });
};
