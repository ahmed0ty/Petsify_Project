const userModel = require("../models/user_model");
const asyncHandler = require("express-async-handler");
const ErrorAPI = require("../utils/ErrorAppi");
const { sendEmail } = require("../utils/sendEmail");
const { htmlMessage } = require("../utils/messageEmail");
const bcrypt = require("bcryptjs");
const { generateAccessToken } = require("../utils/generate_Token");
const sitterModel = require("../models/sitter_model");
const clinicModel = require("../models/clinic_model");
const sellerModel = require("../models/seller_model");
const {
  createOne,
  deleteOne,
  updateOne,
  getOne,
  getAll,
} = require("./factory_handler");

const createUser = createOne(userModel, "User");
const deleteUser = deleteOne(userModel, "User");
const updateUser = updateOne(userModel, "User");
const getUserById = getOne(userModel, "User");
const getAllUseres = getAll(userModel, "User");

const getLoggedUserData = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const getUserDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.getById(id);
  if (!user) {
    return next(new ErrorAPI("User not found", 404));
  }

  const role = user.role;
  const responseData = {
    userId: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    picture: user.picture,
    isActive: user.isActive,
  };

  if (role === "sitter") {
    const data = await sitterModel.getSitterDetails(id);
    if (data) {
      responseData.proofOfExperience = data.proofOfExperience;
      responseData.sitterId = data.id;
      responseData.location = data.location;
    }
  } else if (role === "seller") {
    const data = await sellerModel.getSellerDetails(id);
    if (data) {
      responseData.proofOfBusiness = data.proofOfBusiness;
      responseData.sellerId = data.id;
    }
  } else if (role === "clinic") {
    const data = await clinicModel.getClinicDetails(id);
    if (data) {
      responseData.professionalLicense = data.professionalLicense;
      responseData.clinicId = data.id;
      responseData.location = data.location;
      responseData.startWorkAt = data.startWorkAt;
      responseData.finishWorkAt = data.finishWorkAt;
    }
  }

  res.status(200).json({
    status: "success",
    data: responseData,
  });
});





// const signUpParent = async (req, res, next) => {
//     const verifyCode = Math.floor(10000 + Math.random() * 90000);
//     try {
//         const data = req.body
//         const sharedSalt = await bcrypt.genSalt(8);
//         const hashedPassword = await bcrypt.hash(req.body.password, sharedSalt);
//         req.body.password = hashedPassword,
//             req.body.verifyCode = verifyCode;
//         if (req.file) {
//             data.picture = req.file.filename;
//         }
//         data.isActive = 1
//         const newUser = await userModel.create(data);

//         if (!newUser) {
//             return next(new ErrorAPI(`Failed to create ${modelName}`, 401));
//         }
//         if (newUser[0]) {
//             await sendEmail({
//                 email: req.body.email,
//                 subject: "verification code",
//                 html: htmlMessage(req.body.fullName, req.body.verifyCode)
//             })
//             return res.status(201).json({
//                 status: "success",
//                 message: "Parent account created successfully",
//             })
//         }
//     } catch (error) {
//         return next(new ErrorAPI(error, 400))
//     }
// }


const signUpParent = async (req, res, next) => {
    try {
        const verifyCode = Math.floor(10000 + Math.random() * 90000);
        const data = req.body;
        const { confirmPassword } = data;

        if (data.password !== confirmPassword) {
            return next(new ErrorAPI("Passwords do not match", 400));
        }

  
        delete data.confirmPassword;
        data.role = data.role || "parent";
        const salt = await bcrypt.genSalt(8);
        data.password = await bcrypt.hash(data.password, salt);

        data.verifyCode = verifyCode;
        data.isActive = 1;
        if (req.file) {
            data.picture = req.file.filename;
        }

        const newUser = await userModel.create(data);

        if (!newUser) {
            return next(new ErrorAPI("Failed to create user", 500));
        }

  
        res.status(201).json({
            status: "success",
            message: "Parent account created successfully",
            userId: newUser[0].id
        });

   
sendEmail({
  email: data.email,
  subject: "Verification Code",
  html: htmlMessage(data.fullName, data.verifyCode)
});

    } catch (error) {
        return next(new ErrorAPI(error, 400));
    }
}





module.exports = {
  getAllUseres,
  getUserById,
  getUserDetails,
  updateUser,
  createUser,
  deleteUser,
  signUpParent,
  getLoggedUserData,
};
