
const User = require('../models/user_model')
const ErrorApi = require('../utils/ErrorAppi')
const jwt = require('jsonwebtoken')
// const admin = require('../firebase')


const verifyToken = async (req,res,next)=>{
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            const error = new ErrorApi("Access denied. No token provided", 401)
            return next(error)
        }
        const accessToken = authHeader.split(" ")[1]; // Extract token after "Bearer "
        if(!accessToken){
            const error = new ErrorApi("you are not authorized", 401)
            return next(error)
        }
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        const findUser = await User.getById(decoded.userDataTokenization.id)
        req.user = findUser; 
        next()
    } catch (error) {
        const err = new ErrorApi(error.message, 401)
        return next(err)
    }
}

const verifyAuthorization = (action_name)=>{
    return async (req,res,next)=>{
        try {
            const check = await Permission.checkPermission(req.user.roleId, action_name)
            if(!check){
                const error = new ErrorApi("you are not authorized", 401)
                return next(error)
            }
            next();
        } catch (error) {
            const err = new ErrorApi(error.message, 401)
            return next(err)
        }
    }
}

const verifyTokenIdWhenSignInWithGoogle = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const roleHeader = req.headers["role"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new CustomError("Access denied. No token provided.", 401));
        }

        const idToken = authHeader.split(" ")[1];

        if (!idToken) {
            return next(new CustomError("Unauthorized: No valid token found.", 401));
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        if (!decodedToken) {
            return next(new CustomError("Invalid ID token.", 401));
        }
        // Attach the decoded token (user info) to request object for further use
        decodedToken.roleId = roleHeader;
        req.user = decodedToken;
        next(); // Proceed to next middleware or route handler
    } catch (error) {
        console.error("Error verifying token:", error);
        return next(new CustomError("Token verification failed: " + error.message, 500));
    }
};

module.exports = {
    verifyToken,
    verifyAuthorization,
    verifyTokenIdWhenSignInWithGoogle
}