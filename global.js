const crypto=require("crypto");

const secretky=crypto.randomBytes(32).toString("hex");//可以用来用来生成一个安全且随机的密钥

module.exports={
    secretky
}