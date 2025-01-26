import jwt from "jsonwebtoken"

const JWT_KEY = process.env.JWT_KEY;

const generateVerificationToken = (email) => {
    return jwt.sign({email}, process.env.JWT_KEY, {expiresIn: "1d"});
  };

  export default generateVerificationToken;