const jwt = require("jsonwebtoken");

const AuthenticateUser = async (req, res, next) => {
    const token = req.headers.token;

    let decode = jwt.verify(token, process.env.SECRET_KEY);
    if(decode){
        let userId = decode.id;
        let name = decode.name;
        let role = decode.role;

        res.locals.userId = userId;
        res.locals.name = name;
        res.locals.role = role;

        // console.log("id:",userId,"name: ",name,"role",role);

        next();
    }
    else{
        res.status(401).json("Wrong Credentials")
    }
}

module.exports = {
    AuthenticateUser
}