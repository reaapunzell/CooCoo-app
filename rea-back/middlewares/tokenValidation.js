import jwt from "jsonwebtoken"

const JWT_KEY = process.env.JWT_KEY;

const tokenValidation = (req, res, next) => {
  try {
    // the JWT will be included in the headers
    // under the key "authorization"
    let token = req.headers.authorization
    if (!token) {
      // check for token
      res.status(401).send("authorization missing")
    } else {
      // string parsing to remove the "Bearer " part of the string if present
      if (token.includes("Bearer")) token = token.split(" ")[1]

      // verify the token
      const payload = jwt.verify(token, JWT_KEY)
      if (!payload) {
        res.status(401).send("user not authorized")
      } else {
        next()
      }
    }
  } catch (err) {
    console.log(err)
    res.send(err)
  }
}





export default tokenValidation
