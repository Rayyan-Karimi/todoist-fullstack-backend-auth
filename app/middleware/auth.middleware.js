import dotenv from 'dotenv';
import jsonwebtoken from 'jsonwebtoken';

dotenv.config();

const JWT_KEY = process.env.JWT_KEY || 'your-secret-key';

// Middleware to verify JWT token
export const verifyToken = (request, response, next) => {
    console.log("In verify token, jwt secret is:", JWT_KEY)
    // const token = request.headers['authorization'] && request.headers['authorization'].split(' ')[1];
    const token = request.cookies.token;
    console.log("Token taken from cookies during verification:", token)
    if (!token) {
        return response.status(403).json({ message: 'Token not found during verification in middleware.' });
    }
    try {
        const decoded = jsonwebtoken.verify(token, JWT_KEY);
        console.log('decoded user:', decoded)
        request.userId = decoded.user.id;
        next();
    } catch (err) {
        console.error('JWT verification error:', err);
        return response.status(401).json({ message: 'Invalid or expired token.' });
    }
};

/**
jsonwebtoken.verify(token, process.env.SECRET_KEY, (err, authData)=>{
            if(err){
                res.json({
                    message: "Invalid Token..."
                  });
            } else{
               const role = authData.user.role;
               if(role === "admin"){
                next();
               } else{
                   return res.json({
                       message: "Access Denied! you are not an Admin"
                     });
               }
            }
        })
    } 
}
 */