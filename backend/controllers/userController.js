import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format!" });
        }
        if (!password || password.trim() === "") {
            return res.status(400).json({ message: "Password is required!" });
        }
        
        const user = await userModel.findOne({ email });
        if(!user){
            return res.status(401).json({ message: "User does not exist!" });

        } 
        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            const token = createToken(user._id);

            res.cookie('userToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 7*24*60*60*1000,
            });

            return res.status(200).json({ success: true, token, message: "Login success!" });
        }
        else{
            res.json({ message: "Invalid credentials!" });
        }
    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
};

const createToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await userModel.findOne({ email })
        if(userExists){
            return res.status(401).json({ message: "User already exists!" });
        }

        if(!validator.isEmail(email)){
            return res.status(401).json({ message: "Please enter a valid email!" });
        }
        if(password.length < 5){
            return res.status(401).json({ message: "Password must be at least 5 characters!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });
        const user = await newUser.save();

        const token = createToken(user._id, user.email);

        res.cookie('userToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7*24*60*60*1000,
        });
        return res.json({ success: true, token, message: "Registration successful!" });
    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 7*24*60*60*1000,
            })
            res.status(200).json({ success: true, message: 'Login successful!', token });
        }
        else{
            res.status(401).json({ success: false, message: "Invalid credentials!" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

const verifyUser = async (req, res) => {
    // console.log("Cookies received:", req.cookies);
    const token = req.cookies.token;
    if(!token)  return res.status(401).json({ success: false });

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if(err) return res.status(403).json({ success: false });
        res.status(200).json({ success: true });
    })
}

const adminLogout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })

    return res.status(200).json({
        success: true,
        message: 'Logged out successfully!'
    })
};

const userLogout = (req, res) => {
    res.clearCookie("userToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });
    res.json({ success: true, message: "Logout successful!" });
}

const checkAuth = (req, res) => {
    // console.log('cookies in check auth: ', req.cookies);
    const token = req.cookies.userToken;
    if (!token) {
        return res.json({ authenticated: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // console.log("Decoded User: ", decoded);

        return res.json({ authenticated: true, userId: decoded.id });
    } catch (error) {
        return res.json({ authenticated: false });
    }
}

const refreshToken = async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
      }
  
      // Verify without expiration check first
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, { ignoreExpiration: true });
      
      // Check if token is expired but within grace period
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        return res.status(401).json({ success: false, message: "Token expired" });
      }
  
      // Verify user exists
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }
  
      // Issue new token
      const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
  
      res.cookie('token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
      });
  
      res.status(200).json({ 
        success: true, 
        token: newToken 
      });
  
    } catch (error) {
      console.error("Refresh error:", error);
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  };

const getUserDetails = async (req, res) => {
  try {
    // console.log('cookies in user details', req.cookies);
    const token = req.cookies.userToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Get user details excluding password
    const user = await userModel.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("Get user details error:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const updateUserDetails = async (req, res) => {
    try {
        const token = req.cookies.userToken;
        const { name, email } = req.body.updatedDetails;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const updatedUser = await userModel.findByIdAndUpdate(decoded.id, { name, email }, { new: true });
        if(updatedUser){
            res.status(200).json({ success: true, message: "Details updated successfully!" });
        }
        else{
            res.status(401).json({ success: false, message: "Something went wrong!" });
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message })
    }
    
}


export { loginUser, registerUser, adminLogin, verifyUser, adminLogout, userLogout, checkAuth, refreshToken, getUserDetails, updateUserDetails };