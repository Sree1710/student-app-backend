const jwt = require("jsonwebtoken");
const Batches = require("../models/batches.model");
const Validator = require("../config/data.validate")


exports.batchCreate = (request, response) => {

    const batchToken = request.body.token;

    //checking validations
    const validationErrors = {};

    if (Validator.isEmpty(request.body.collegeId).isValid) {
        validationErrors.value = Validator.isEmpty(request.body.collegeId).message;
    }
    if (!Validator.isValidName(request.body.batchName).isValid) {
        validationErrors.name = Validator.isValidName(request.body.batchName).message
    }

    if (!Validator.isDateGreaterThanToday(request.body.regStartDate).isValid) {
        validationErrors.regstartdate = Validator.isDateGreaterThanToday(request.body.regStartDate).message;
    }
    if (!Validator.isValidDate(request.body.regStartDate).isValid) {
        validationErrors.regstartdate = Validator.isValidDate(request.body.regStartDate).message
    }

    if (!Validator.isDateGreaterThanToday(request.body.regEndDate).isValid) {
        validationErrors.regenddate = Validator.isDateGreaterThanToday(request.body.regEndDate).message
    }
    if (!Validator.isValidDate(request.body.regEndDate).isValid) {
        validationErrors.regenddate = Validator.isValidDate(request.body.regEndDate).message
    }

    if (Validator.isEmpty(request.body.batchDesc).isValid) {
        validationErrors.description = Validator.isEmpty(request.body.batchDesc).message
    }

    if (!Validator.isValidAmount(request.body.batchAmount).isValid) {
        validationErrors.amount = Validator.isValidAmount(request.body.batchAmount).message
    }


    if (Object.keys(validationErrors).length > 0) {
        return response.json({ "status": "Validation failed", "data": validationErrors })
    }



    const batches = new Batches({
        collegeId: request.body.collegeId,
        batchName: request.body.batchName,
        regStartDate: request.body.regStartDate,
        regEndDate: request.body.regEndDate,
        batchDesc: request.body.batchDesc,
        batchAmount: request.body.batchAmount
    });


    Batches.batchCreate(batches, (err, data) => {
        if (err) {
            return response.json({ "status": err });
        }

        // Verify token using middleware or another appropriate place
        jwt.verify(batchToken, "studentapp", (err, decoded) => {
            if (decoded) {
                return response.json({ "status": "success", "data": data });
            } else {
                return response.json({ "status": "Unauthorized User!!" });
            }
        });
    });
}
