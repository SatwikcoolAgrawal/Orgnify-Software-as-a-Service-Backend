const authroute=require("./auth")
const userroute=require("./users")
const serviceroute=require("./service")
const cartroute=require("./cart")
const paymentroute = require("./payment")

const adminroute = require("./admin")
module.exports={authroute,userroute, serviceroute, adminroute, paymentroute,cartroute}