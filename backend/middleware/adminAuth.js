import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try {
        // console.log('cookies in admin', req.cookies);
        const token = req.cookies.token;
        
        if(!token) return res.status(401).json({ success: false, message: "Unauthorized!" });

        // console.log('Admin token', token);

        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // console.log('Token decoded: ', tokenDecoded);

        if(tokenDecoded.email !== process.env.ADMIN_EMAIL){
            return res.status(401).json({ success: false, message: "Unauthorized!" });
        }
        req.admin = tokenDecoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: "Unauthorized!" });
    }
}

export default adminAuth;


