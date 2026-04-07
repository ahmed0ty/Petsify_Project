const userModel = require("../models/user_model");
const clinicModel = require("../models/clinic_model");
const asyncHandler = require("express-async-handler");
const ErrorAPI = require("../utils/ErrorAppi");
const { sendEmail } = require('../utils/sendEmail')
const { htmlMessage } = require('../utils/messageEmail')
const bcrypt = require('bcryptjs');
const { generateAccessToken } = require("../utils/generate_Token")
const {
    createOne,
    deleteOne,
    updateOne,
    getOne,
    getAll,
} = require("./factory_handler");

// const createUser = createOne(userModel, "User");
// const deleteUser = deleteOne(userModel, "User");
// const updateUser = updateOne(userModel, "User");
// const getUserById = getOne(userModel, "User");
// const getAllUseres = getAll(userModel, "User");


const signUpClinic = async (req, res, next) => {
    const verifyCode = Math.floor(10000 + Math.random() * 90000);
    try {
        const sharedSalt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(req.body.password, sharedSalt);
        req.body.password = hashedPassword,
            req.body.verifyCode = verifyCode;

        if (req.files) {
            req.body.professionalLicense = req.files.professionalLicense?.[0]?.filename;
            req.body.picture = req.files.picture?.[0]?.filename;
        }
        const userData = {
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            verifyCode: req.body.verifyCode,
            picture: req.body.picture,
            role: req.body.role,
        }
        const userId = await userModel.create(userData);
        if (!userId[0]) {
            return next(new ErrorAPI(`Failed to create seller`, 401));
        }

        const clinicData = {
            userId : userId[0],
            professionalLicense: req.body.professionalLicense,
            location: req.body.location,
            startWorkAt: req.body.startWorkAt,
            finishWorkAt: req.body.finishWorkAt,
        }
        const createClinic = await clinicModel.create(clinicData)
        if (createClinic[0]) {
            await sendEmail({
                email: req.body.email,
                subject: "verification code",
                html: htmlMessage(req.body.fullName, req.body.verifyCode)
            })
            return res.status(201).json({
                status: "success",
                message: "Clinic account created successfully",
            })
        }
    } catch (error) {
        return next(new ErrorAPI(error, 400))
    }
}

const getAllClinicAcocount =async (req, res, next) => {
    try {
        const data = await clinicModel.getAllClinicAcocountDetails()
        return res.status(200).json({
            status: "success",
            data,
        })
    } catch (error) {
        next(new ErrorAPI(error, 400))
    }
}

module.exports = {
    // getAllUseres,
    // getUserById,
    // updateUser,
    // createUser,
    // deleteUser,
    signUpClinic,
    getAllClinicAcocount,
}