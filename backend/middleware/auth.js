import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    // console.log('cookies received: ', req.cookies);
    const token = req.cookies.userToken;
    if (!token) throw new Error("No token");

    // console.log('User Token', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log('decode in auth user: ',decoded);
    req.user = { id: decoded.id };
    // console.log('Authenticated user:', req.user);
    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    res.status(401).json({ success: false, message: "Please login again" });
  }
};

export default authUser;    
