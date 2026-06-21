const userModel = require("../models/user_model");
const sitterModel = require("../models/sitter_model");
const clinicModel = require("../models/clinic_model");
const sellerModel = require("../models/seller_model");
const asyncHandler = require("express-async-handler");
const ErrorAPI = require("../utils/ErrorAppi");
const db = require("../config/db");

/**
 * Standard endpoint for editing profile for all roles
 * PUT /api/v1/auth/updateProfile
 */
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.body;
        if (!id) {
            return next(new ErrorAPI("User ID is required in the request body", 400));
        }

        const userId = id;
        const user = await userModel.getById(userId);
        if (!user) {
            return next(new ErrorAPI("User not found", 404));
        }

        const role = user.role;
        const updateData = { ...req.body };

        const userFields = ["fullName", "email", "phone"];
const userData = {};

userFields.forEach((field) => {
    if (updateData[field] !== undefined && updateData[field] !== "") {
        userData[field] = updateData[field];
    }
});

        if (req.file) {
            userData.picture = req.file.path;
        }

        await db.transaction(async (trx) => {
            if (Object.keys(userData).length > 0) {
                await trx("user").where({ id: userId }).update(userData);
            }

            if (role === "sitter") {
                const sitterData = {};
                if (updateData.location) sitterData.location = updateData.location;
                if (Object.keys(sitterData).length > 0) {
                    await trx("sitter").where({ userId }).update(sitterData);
                }
            } else if (role === "clinic") {
                const clinicData = {};
                if (updateData.location) clinicData.location = updateData.location;
                if (updateData.startWorkAt) clinicData.startWorkAt = updateData.startWorkAt;
                if (updateData.finishWorkAt) clinicData.finishWorkAt = updateData.finishWorkAt;
                if (Object.keys(clinicData).length > 0) {
                    await trx("clinic").where({ userId }).update(clinicData);
                }
            }
        });

        const updatedUser = await userModel.getById(userId);
        const responseData = {
            userId: updatedUser.id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
            picture: updatedUser.picture,
        };

        if (role === "sitter") {
            const data = await sitterModel.getSitterDetails(userId);
            responseData.proofOfExperience = data.proofOfExperience;
            responseData.sitterId = data.id;
            responseData.location = data.location;
        } else if (role === "seller") {
            const data = await sellerModel.getSellerDetails(userId);
            responseData.proofOfBusiness = data.proofOfBusiness;
            responseData.sellerId = data.id;
        } else if (role === "clinic") {
            const data = await clinicModel.getClinicDetails(userId);
            responseData.professionalLicense = data.professionalLicense;
            responseData.clinicId = data.id;
            responseData.location = data.location;
            responseData.startWorkAt = data.startWorkAt;
            responseData.finishWorkAt = data.finishWorkAt;
        }

        res.status(200).json({
            status: "success",
            message: "Profile updated successfully",
            userDetails: responseData,
        });

    } catch (error) {
        console.error("❌ updateUserProfile error:", error);
        return next(new ErrorAPI(error.message || "Update failed", 500));
    }
});