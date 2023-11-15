const jwt=require('jsonwebtoken');

const JwtDecoder=(req,res,next)=>{
    try{
    if (!req.headers.authorization) res.status(400).json({error:"token not found"});
    const data=jwt.decode(req.headers.authorization);
    req.user=data;
    next();
    }
    catch(error){
        res.status(500).json({error});
    }
}


module.exports=JwtDecoder;