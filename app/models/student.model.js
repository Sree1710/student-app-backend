const db = require("../models/db");

const Student = function (student) {
    this.id = student.id;
    this.collegeId = student.collegeId;
    this.batchId = student.batchId;
    this.studName = student.studName;
    this.admNo = student.admNo;
    this.rollNo = student.rollNo;
    this.studDept = student.studDept;
    this.course = student.course;
    this.studEmail = student.studEmail;
    this.studPhNo = student.studPhNo;
    this.studProfilePic = student.studProfilePic;
    this.aadharNo = student.aadharNo;
    this.password = student.password;
    this.membership_no = student.membership_no;
};

Student.create = (newStudent, result) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const membershipNoPrefix = "LMS";

    db.query("SELECT * FROM student WHERE admNo = ? AND collegeId = ? AND batchId = ? AND deleteStatus = 0 AND isActive = 1", 
    [newStudent.admNo, newStudent.collegeId, newStudent.batchId], (err, res) => {
        if (err) {
            console.error("Error while checking uniqueness: ", err);
            result(err, null);
            return;
        } else {
            if (res.length > 0) {
                console.log("Admission No already exists");
                result("Admission No already exists", null);
                return;
            } else {
                db.query("SELECT * FROM student WHERE rollNo = ? AND collegeId = ? AND batchId = ? AND deleteStatus = 0 AND isActive = 1", 
                [newStudent.rollNo, newStudent.collegeId, newStudent.batchId],
                    (err, res) => {
                        if (err) {
                            console.error("Error while checking uniqueness: ", err);
                            result(err, null);
                            return;
                        } else {
                            if (res.length > 0) {
                                console.log("Roll No already exists");
                                result("Roll No already exists", null);
                                return;
                            } else {
                                db.query("SELECT * FROM student WHERE aadharNo = ? AND deleteStatus = 0 AND isActive = 1",
                                    [newStudent.aadharNo], (err, res) => {
                                        if (err) {
                                            console.error("Error while checking uniqueness: ", err);
                                            result(err, null);
                                            return;
                                        } else {
                                            if (res.length > 0) {
                                                console.log("Aadhar No already exists");
                                                result("Aadhar No already exists", null);
                                                return;
                                            } else {
                                                db.query("SELECT * FROM student WHERE studEmail = ? AND deleteStatus = 0 AND isActive = 1",
                                                    [newStudent.studEmail], (err, res) => {
                                                        if (err) {
                                                            console.error("Error while checking uniqueness: ", err);
                                                            result(err, null);
                                                            return;
                                                        } else {
                                                            if (res.length > 0) {
                                                                console.log("Email already exists");
                                                                result("Email already exists", null);
                                                                return;
                                                            } else {
                                                                db.query("UPDATE counter SET Counter = Counter + 1", (err, updateRes) => {
                                                                    if (err) {
                                                                        console.error("Error while updating counter: ", err);
                                                                        result(err, null);
                                                                        return;
                                                                    }

                                                                    db.query("SELECT Counter FROM counter", (err, counterRes) => {
                                                                        if (err) {
                                                                            console.error("Error while fetching counter value: ", err);
                                                                            result(err, null);
                                                                            return;
                                                                        }

                                                                        const currentCounter = counterRes[0].Counter.toString().padStart(5, "0");
                                                                        const finalMembershipNo = `${membershipNoPrefix}${currentYear}${currentMonth}${currentCounter}`;

                                                                        newStudent.membership_no = finalMembershipNo;
                                                                        db.query("INSERT INTO student SET ?", newStudent, (err, res) => {
                                                                            if (err) {
                                                                                console.error("Error while inserting a new student: ", err);
                                                                                result(err, null);
                                                                                return;
                                                                            }
                                                                            console.log("New student added: ", { id: res.insertId, ...newStudent });
                                                                            result(null, { id: res.insertId, ...newStudent });
                                                                        });
                                                                    });
                                                                });

                                                            }
                                                        }
                                                    });
                                            }

                                        }

                                    });
                            }
                        }

                    });
            }
        }
    });
};

module.exports = Student;
