// const asyncHandler=require("express-async-handler")
// const jwt = require("jsonwebtoken");

// const validateToken=asyncHandler(async (req,res,next)=>{
//     let token
//     let authHeader= req.headers.Authorization || req.headers.authorization
//     if(authHeader && authHeader.startsWith("Bearer")){
//         token=authHeader.split(" ")[1];

//         if(token === ""){
//             res.status(401);
//             throw new Error("User is not authorized or the token is missing");
//         }

//         jwt.verify(token,process.env.ACCESS_TOKEN_SECERT,(err,decode)=>{
//             if(err){
//                 res.status(401)
//                 throw new Error("User is not authorized");
//             }
//             // console.log(decode)
//             req.user=decode.user
//             next();
//         })
//     }

// })

// module.exports = validateToken;

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token; // Assuming the access token is stored in a cookie named 'token'

  if (!token) {
    res.status(401);
    throw new Error("User is not authorized or the token is missing");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decode) => {
    if (err) {
      res.status(401);
      throw new Error("User is not authorized");
    }
    // console.log(decode)
    req.user = decode.user;
    next();
  });
});

module.exports = validateToken;
