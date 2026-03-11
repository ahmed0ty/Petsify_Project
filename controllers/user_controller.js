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
//   const verifyCode = Math.floor(10000 + Math.random() * 90000);
//   try {
//     // const data = req.body // القديم
//     const data = req.body; // الجديد: ناخد نسخة من req.body
//     const { confirmPassword } = data; // الجديد: ناخد confirmPassword للتحقق

//     // ✅ التحقق من تطابق الباسورد
//     if (data.password !== confirmPassword) {
//       return next(new ErrorAPI("Passwords do not match", 400));
//     }

//     // ✅ إزالة confirmPassword قبل الحفظ
//     delete data.confirmPassword;

//     // ✅ تشفير الباسورد
//     const sharedSalt = await bcrypt.genSalt(8);
//     data.password = await bcrypt.hash(data.password, sharedSalt);

//     // ✅ تعيين verifyCode و isActive و role افتراضي
//     data.verifyCode = verifyCode;
//     data.isActive = 1;
//     // القديم
//     data.role = data.role || "parent";

//     // الجديد (اضافة force)
//     if (!data.role) {
//       data.role = "parent";
//     }
//     // ✅ التعامل مع الصورة لو موجودة
//     if (req.file) {
//       data.picture = req.file.filename;
//     }

//     // ✅ إنشاء المستخدم في قاعدة البيانات
//     const newUser = await userModel.create(data);

//     // ✅ التحقق بعد الإنشاء وإرسال الإيميل
//     if (!newUser) {
//       return next(new ErrorAPI(`Failed to create user`, 401));
//     }
//     if (newUser[0]) {
//       await sendEmail({
//         email: data.email, // استخدمنا data بدل req.body
//         subject: "verification code",
//         html: htmlMessage(data.fullName, data.verifyCode), // استخدمنا data بدل req.body
//       });
//       return res.status(201).json({
//         status: "success",
//         message: "Parent account created successfully",
//       });
//     }
//   } catch (error) {
//     return next(new ErrorAPI(error, 400));
//   }
// };


const signUpParent = async (req, res, next) => {
    try {
        const verifyCode = Math.floor(10000 + Math.random() * 90000);
        const data = req.body;
        const { confirmPassword } = data;

        // 1️⃣ تحقق من تطابق الباسورد
        if (data.password !== confirmPassword) {
            return next(new ErrorAPI("Passwords do not match", 400));
        }

        // 2️⃣ إزالة confirmPassword قبل الإدخال
        delete data.confirmPassword;

        // 3️⃣ تعيين role افتراضي لو مش موجود
        data.role = data.role || "parent";

        // 4️⃣ تشفير الباسورد
        const salt = await bcrypt.genSalt(8);
        data.password = await bcrypt.hash(data.password, salt);

        // 5️⃣ تعيين verifyCode و isActive
        data.verifyCode = verifyCode;
        data.isActive = 1;

        // 6️⃣ صورة المستخدم لو موجودة
        if (req.file) {
            data.picture = req.file.filename;
        }

        // 7️⃣ إدخال المستخدم في قاعدة البيانات
        const newUser = await userModel.create(data);

        if (!newUser) {
            return next(new ErrorAPI("Failed to create user", 500));
        }

        // 8️⃣ Response فورًا قبل إرسال الإيميل
        res.status(201).json({
            status: "success",
            message: "Parent account created successfully",
            userId: newUser[0].id
        });

        // 9️⃣ إرسال الإيميل بشكل async (مستقل عن response)
        sendEmail({
            email: data.email,
            subject: "Verification Code",
            html: htmlMessage(data.fullName, data.verifyCode)
        }).catch(err => console.log("Email sending failed:", err));

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
