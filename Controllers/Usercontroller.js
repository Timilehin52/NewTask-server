const USER = require("../Models/Userschema.js")
const JWT = require("jsonwebtoken")
const bcrypt = require("bcrypt")
//const { sendWelcomeEmail, sendResetPasswordMail } = require("../Utils/sendEmail")

//Generate JsonWebToken
const generateToken = (user) => {
  const { _id, email, role } = user;
  const token = JWT.sign({ id: _id, email, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  console.log(token);
  return token;
};


const signup = async (req, res) => {
    console.log("Incoming signup request")

    const { firstName, lastName, email, phoneNumber, password } = req.body
    console.log(req.body);

    try {
        //validate data coming from the request
        if (!firstName || !lastName || !email || !phoneNumber || !password) {
          return res.status(400).json({ success : false , message : "Please provide all credentials"})
        }
        //if user exists? -- findOne()
        const existingUser = await USER.findOne({
            $or: [{email}, {phoneNumber}],
        })
        if (existingUser) {
            let message = "";
            if (existingUser.email === email) {
                message = "Email address already registered to an existing user";
            } else if (existingUser.phoneNumber === phoneNumber) {
                message = "Phone number already registered to an existing user";
            } else {
                message = "User already exists with provided credentials";
            }
            return res.status(400).json({ success : false, message})
        }

        //protect password by hashing
        const hashedPassword = await bcrypt.hash(password,10)
        
        //create user acct
        const user = new USER({
            firstName : firstName,
            lastName : lastName,
            email : email,
            phoneNumber : phoneNumber,
            password : hashedPassword
        })
        await user.save()

        const token = generateToken(user)

       

        res.status(201).json({ success : true, message : "User created successfully", token, user : { id : user._id, firstName: user.firstName, lastName : user.lastName, email : user.email, phoneNumber : user.phoneNumber, role : user.role}})
    } catch (error) {
       
        console.error(error);
        res.status(500).json({ success : false, message : "Signup failed", error : error.message})
    }
}

const signin = async (req,res)=>{
    console.log("Incoming Sign in request");

    const {email, password} = req.body;
    console.log(req.body);
    try {
        //find user in db
        const user = await USER.findOne({email})
        if (!user) {
            return res.status(404).json({ success : false , message : "User not found"})
        }
        //compare password if there is a user
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ success : false, message : "Invalid credentials"})
        }
        
        //create session token
        const token = generateToken(user)

        res.status(200).json({
            success : true,
            message : "Login Successful",
            token,
            user : { 
                id : user._id, 
                firstName: user.firstName, 
                lastName : user.lastName, 
                email : user.email, 
                phoneNumber : user.phoneNumber,
                role : user.role
            }
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ 
            success : false, 
            message : "Login failed",
            error : error.message
        })
    }
}


module.exports = { signup, signin }

