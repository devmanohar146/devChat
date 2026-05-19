const jwt = require("jsonwebtoken")

const generateToken = (id,email)=>{
    const payload = {
        id,
        email,
        role:"admin"
    }

    return jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
}

module.exports = generateToken