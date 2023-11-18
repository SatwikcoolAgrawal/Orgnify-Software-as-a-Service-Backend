const jwt = require('jsonwebtoken');

const JwtDecoder = (req, res, next) => {
    try {
        if (!req.headers.authorization) return res.status(400).json({ error: "token not found" });
        const data = jwt.decode(req.headers.authorization);
        req.user = data;
        next();
    }
    catch (error) {
        res.status(500).json({ error });
    }
}




const CorsHeader=(req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "https://your-frontend.com"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Private-Network", true);
    
    res.setHeader("Access-Control-Max-Age", 7200);
    next();
};


module.exports = {JwtDecoder,CorsHeader};