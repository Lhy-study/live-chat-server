const router=require("express").Router();
const prisma = require("../prisma")
const { startConversation, getConverIdList,getConverChatInfo} = require("../api/conversation")
const { secretky} =require("../global")
const jwt = require("jsonwebtoken") 

//查看是否有权限
router.use((request,response,next)=>{
    const token=request.headers['authorization']; //获取到存储到客户端的token;
    if(token){
        jwt.verify(token,secretky,(e,user)=>{
            // console.log(user);
            if(e){
                response.send({
                    code:401,
                    msg:"很抱歉，您还没有登录，登录后方可进行"
                });
            }else{
                request.user=user;
                next();
            }
        });
    }else{
        response.send({
            code:401,
            msg:"很抱歉，您还没有登录过"
        })
    }
});

//获取会话id
router.get("/getConverIdList",(request,response)=>{
    const { uid } = request.user
    getConverIdList(uid)
        .then((data)=>{
            response.send({
                code:200,
                msg:"获取成功",
                data,
            })
        })
        .catch((e)=>{
            console.log(e);
            response.send({
                code:500,
                msg:"系统出错，请稍后再试",
                errMsg:e
            })
        })
        .finally(() => {
            prisma.$disconnect();
        })
})

//  创建/开始聊天
router.post("/startChat",(request,response)=>{
    const { friendId } = request.body
    const { uid } = request.user
    startConversation(friendId,uid)
        .then((data)=>{
            response.send({
                code:200,
                data,
                msg:"创建会话成功"
            })
        })
        .catch((e)=>{
            response.send({
                code:500,
                msg:"很抱歉，系统出错，请稍后重试",
                errMsg:e
            })
        })
        .finally(() => {
            prisma.$disconnect();
        })
})


module.exports=router