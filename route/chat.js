const router=require("express").Router();
const prisma = require("../prisma")
const { getChatInfoList , sendChatInfo} = require("../api/chat")
const { secretky} =require("../global")
const jwt = require("jsonwebtoken"); 

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

//获取某个会话的所有消息
router.post("/getChatInfoList",(request,response)=>{
    const { convId } = request.body
    getChatInfoList(convId)
        .then((data)=>{
            response.send({
                code:200,
                msg:"成功",
                data
            })
        })
        .catch((e)=>{
            response.send({
                code:500,
                msg:e.message,
                errMsg:e
            })
        })
        .finally(()=>{
            prisma.$disconnect()
        })
});

// router.post("/sendChatInfo",(request,response)=>{
//     const { convId, senderId , content , contentType} = request.body;
//     // console.log(contentType);
//     sendChatInfo({convId,senderId,content,contentType})
//         .then((data)=>{
//             response.send({
//                 code:200,
//                 msg:"成功",
//                 data
//             })
//         })
//         .catch((e)=>{
//             console.log(e);
//             response.send({
//                 code:500,
//                 msg:e.message,
//                 errMsg:e
//             })
//         })
//         .finally(()=>{
//             prisma.$disconnect()
//         })
// });

module.exports=router