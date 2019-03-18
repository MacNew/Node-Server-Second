const app=require("express")(),
jwt = require("jsonwebtoken")

const protectedRoute=app;


protectedRoute.use((req,res,next)=>{
    var token = req.headers['auth-token'];
    // decode token
    if (token) {
        // verifies secret and checks if the token is expired
        jwt.verify(token, app.get("SECRET"), (err, decoded)=> {
            if (err) {
                res.statusCode=409
                return res.json({message: 'invalid token'});
            } else {
                // if everything is good , save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        res.status(502)
        res.json({
             message: 'No token provided.'
        })
    }
})

module.exports=protectedRoute;