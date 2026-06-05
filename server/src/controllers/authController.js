const bcrypt = require("bcryptjs")
const User = require("../models/User")
const generateToken = require("../utils/gererateToken")

//register
const registerUser = async (req,res)=>{
    try {
        const {username,email,password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({
                message:"All feild requires"
            })
        }

      const userExist =  await User.findOne({email})
      if(userExist){
        return res.status(400).json({
            message:"user already exit"
        })
      }
      // hash pwd
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password,salt)
        const user = User.create({
            username,
            email,
            password:hashedPassword
        })
        
        res.status(201).json({
            _id:user._id,
            username:user.username,
            email:(await user).email,
            token:generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        });
    }
}

const loginUser = async (req, res) => {
    try {
        console.log("login hit")
        const { email, password } = req.body;

        // 1. Find user
        const user = await User.findOne({ email });
        
        // If user not found, exit early
        if (!user) {
            return res.status(401).json({
                message: "invalid credentials"
            });
        }

        // 2. Compare password (outside the if-block)
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({
                message: "invalid credentials"
            });
        }

        // 3. Success response
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id,user.email)
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

const getMe = async (req, res) => {
  res.json(req.user);
};


module.exports = {
    registerUser,
    loginUser,
    getMe
}