const path = require('path');


function isEmpty(value) {
    return {
        isValid: (value === null || value === ""),
        message: "Value cannot be empty."
    };
}


function isValidPhoneNumber(phoneNumber) {
    if (phoneNumber === null || phoneNumber === "") {
        return {
            isValid: true,
        };
    }
    return {
        isValid: /^\d{2,5}-?\d{6,8}$/.test(phoneNumber),
        message: "Invalid Phone Number"
    };
}

function isValidImageWith1mbConstratint(file) {
    // Accept only JPG and JPEG files
    const allowedExtensions = /\.(jpg|jpeg|png|webp|heif)$/;

    // Check file extension
    const extensionIsValid = allowedExtensions.test(path.extname(file.filename).toLowerCase());

    // Check file size (max 1 MB)
    const maxFileSize = 1 * 1024 * 1024; // 1 MB in bytes
    const sizeIsValid = file.size <= maxFileSize;

    if (!extensionIsValid && !sizeIsValid) {
        return {
            isValid: false,
            message: 'Invalid image format and size exceeds the limit of 1 MB.'
        };
    } else if (!extensionIsValid) {
        return {
            isValid: false,
            message: 'Invalid image format. Only JPG, JPEG, PNG, WEBP and HEIF files are allowed.'
        };
    } else if (!sizeIsValid) {
        return {
            isValid: false,
            message: 'Image size exceeds the limit of 1 MB.'
        };
    }

    return {
        isValid: true,
        message: 'Image is valid'
    };
}


function isValidMobileNumber(mobileNumber) {
    // Check if the number is in the format +91XXYYYYYYYY or XXYYYYYYYY with the first digit after +91 greater than 5
    return {
        isValid: /^\+91[6-9]\d{9}$|^[6-9]\d{9}$/.test(mobileNumber),
        message: "Invalid Mobile Number"
    };
}

function isValidAmount(amount) {
    return {
        isValid: amount > 0,
        message: "Amount must be greater than zero"
    };
}


function isValidAddress(address) {
    return {
        isValid: !address || address.length <= 100,
        message: "Address cannot be empty and should not exceed 100 characters"
    };
}

function isValidWebsite(website) {
    if (website === null || website === "") {
        return {
            isValid: true,
        };
    }

    return {
        isValid: /^www\.[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/.test(website),
        message: "Website must be in the format www.example.com"
    };
}


function isValidEmail(email) {
    return {
        isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: "Invalid Email"
    };
}

function isValidPassword(password) {
    return {
        isValid: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,12}$/.test(password),
        message: "Password must contain at least 8 characters, including upper and lowercase letters and numbers"
    };
}

function isValidName(name) {
    return {
        isValid: /^[a-zA-Z\s]*$/.test(name),
        message: "Name must contain only alphabets"
    };
}



function isValidDate(date) {
    return {
        isValid: /^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/.test(date),
        message: "Date must be in the format DD/MM/YYYY"
    };
}

function isDateGreaterThanToday(date) {
    const inputDate = new Date(date);
    const currentDate = new Date();

    return {
        isValid: inputDate > currentDate,
        message: "Select a date greater than today."
    };
}

function isValidTime(time) {
    return {
        isValid: /^\d{2}:\d{2}:\d{2}$/.test(time),
        message: "Time must be in the format HH:MM:SS"
    };
}


function isValidAadharNumber(aadharNumber) {
    return {
        isValid: /^\d{12}$/.test(aadharNumber),
        message: "Aadhar Number must be 12 digits"
    };
}

function isValidFile(file) {
    // Accept only JPG and JPEG files
    const allowedExtensions = /\.(pdf|docx)$/;

    // Check file extension
    const extensionIsValid = allowedExtensions.test(path.extname(file.filename).toLowerCase());

    // Check file size (max 1 MB)
    const maxFileSize = 1 * 1024 * 1024; // 1 MB in bytes
    const sizeIsValid = file.size <= maxFileSize;

    if (!extensionIsValid && !sizeIsValid) {
        return {
            isValid: false,
            message: 'Invalid file format and size exceeds the limit of 1 MB.'
        };
    } else if (!extensionIsValid) {
        return {
            isValid: false,
            message: 'Invalid file format. Only PDF and DOCX files are allowed.'
        };
    } else if (!sizeIsValid) {
        return {
            isValid: false,
            message: 'Image size exceeds the limit of 1 MB.'
        };
    }

    return {
        isValid: true,
        message: 'Image is valid'
    };
}



module.exports = {
    isEmpty,
    isValidPhoneNumber,
    isValidMobileNumber,
    isValidAddress,
    isValidWebsite,
    isValidEmail,
    isValidPassword,
    isValidName,
    isValidDate,
    isValidTime,
    isValidImageWith1mbConstratint,
    isValidAadharNumber,
    isValidAmount,
    isDateGreaterThanToday,
    isValidFile
};