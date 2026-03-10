const userModel = require("../models/user_model")
const sitterModel = require("../models/sitter_model")
const clinicModel = require("../models/clinic_model")
const sellerModel = require("../models/seller_model")
const ErrorAPI = require("../utils/ErrorAppi");
const bcrypt = require('bcryptjs');
const { generateAccessToken } = require("../utils/generate_Token")


const login = async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return next(new ErrorAPI("missing email or password credential", 400))
    }
    const { email, password } = req.body
    try {
        const existingUser = await userModel.getByEmail(email);
        if (!existingUser) {
            return next(new ErrorAPI("missing credential", 400))
        }
        const isMatchPass = await bcrypt.compare(password, existingUser.password);
        if (!isMatchPass) {
            return next(new ErrorAPI("missing credential", 400))
        }
        if (existingUser.emailIsVerified !== 1 || existingUser.isActive !== 1) {
            return next(new ErrorAPI("please verify your email, or may be your account is disabled", 400))
        }
        const userDetails = {
            userId: existingUser.id,
            fullName: existingUser.fullName,
            email: existingUser.email,
            phone: existingUser.phone,
            role: existingUser.role,
            picture: existingUser.picture,
        }
        if (existingUser.role == "sitter") {
            const data = await sitterModel.getSitterDetails(existingUser.id)
            userDetails.proofOfExperience = data.proofOfExperience
            userDetails.sitterId = data.id
            userDetails.location = data.location
        }
        if (existingUser.role == "seller") {
            const data = await sellerModel.getSellerDetails(existingUser.id)
            userDetails.proofOfBusiness = data.proofOfBusiness
            userDetails.sellerId = data.id
        }
        if (existingUser.role == "clinic") {
            const data = await clinicModel.getClinicDetails(existingUser.id)
            userDetails.professionalLicense = data.professionalLicense
            userDetails.clinicId = data.id
            userDetails.location = data.location
            userDetails.startWorkAt = data.startWorkAt
            userDetails.finishWorkAt = data.finishWorkAt
        }
        userDataTokenization = {
            id: existingUser.id,
            role: existingUser.role,
        }
        const token = generateAccessToken({ userDataTokenization })
        return res.status(200).json({
            status: "success",
            token,
            userDetails
        })
    } catch (error) {
        return next(new ErrorAPI(error, 400))
    }
}







const verifyCode = async (req, res, next) => {
    if (!req.body.email || !req.body.verifyCode) {
        return next(new ErrorAPI("missing email or verifycode credential", 400))
    }
    const user = await userModel.verifyCode(req.body)
    if (!user) {
        return next(new ErrorAPI("incorrect credential email or verify code", 400))
    }
    const update = await userModel.update(user.id, { emailIsVerified: 1 })
    if (update) {
        user.emailIsVerified = 1
        return res.status(200).json({
            status: "success",
            user
        })
    }
}

const forgetPassword = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorAPI("Email is required", 400));
    }

    try {
        // Check if user exists
        const existingUser = await userModel.getByEmail(email);
        if (!existingUser) {
            return next(new ErrorAPI("No account found with this email", 404));
        }

        // Generate 5-digit verification code
        const verifyCode = Math.floor(10000 + Math.random() * 90000);

        // Update user with new verification code
        await userModel.update(existingUser.id, { verifyCode });

        // Send email with verification code
        const { sendEmail } = require('../utils/sendEmail');
        const { htmlMessage } = require('../utils/messageEmail');

        await sendEmail({
            email: existingUser.email,
            subject: "Password Reset Verification Code",
            html: htmlMessage(existingUser.fullName, verifyCode)
        });

        return res.status(200).json({
            status: "success",
            message: "Verification code sent to your email"
        });
    } catch (error) {
        return next(new ErrorAPI(error.message || "Failed to send verification code", 400));
    }
}

const verifyCodeForgetPassword = async (req, res, next) => {
    const { email, verifyCode } = req.body;

    if (!email || !verifyCode) {
        return next(new ErrorAPI("Email and verification code are required", 400));
    }

    try {
        // Verify the code matches
        const user = await userModel.verifyCode({ email, verifyCode });

        if (!user) {
            return next(new ErrorAPI("Invalid verification code", 400));
        }

        return res.status(200).json({
            status: "success",
            message: "Verification code is valid"
        });
    } catch (error) {
        return next(new ErrorAPI(error.message || "Verification failed", 400));
    }
}

const resetPassword = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorAPI("Email and new password are required", 400));
    }

    if (password.length < 6) {
        return next(new ErrorAPI("Password must be at least 6 characters", 400));
    }

    try {
        // Check if user exists
        const existingUser = await userModel.getByEmail(email);
        if (!existingUser) {
            return next(new ErrorAPI("User not found", 404));
        }

        // Hash the new password
        const sharedSalt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(password, sharedSalt);

        // Update password and clear verification code
        await userModel.update(existingUser.id, {
            password: hashedPassword,
            verifyCode: null
        });

        return res.status(200).json({
            status: "success",
            message: "Password has been reset successfully"
        });
    } catch (error) {
        return next(new ErrorAPI(error.message || "Failed to reset password", 400));
    }
}

module.exports = {
    login,
    verifyCode,
    forgetPassword,
    verifyCodeForgetPassword,
    resetPassword
}