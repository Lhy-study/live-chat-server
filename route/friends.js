const router=require("express").Router()
const prisma =require("../prisma");
const jwt=require("jsonwebtoken")
const { sendReq , getFriReq , agreeFriReq ,getMyFriend } =require("../api/friend")
const { secretky} =require("../global") 

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

//添加好友请求
router.post("/sendFriReq",(request,response)=>{
    const { targetId }  =request.body 
    const { uid } = request.user
    if(targetId === uid){
        response.send({
            code:400,
            msg:"您不可以自我好友申请!!!"
        })
        return
    }
    // console.log("--------");
    // console.log(request.user);
    sendReq(uid,targetId)
        .then(()=>{
            response.send({
                code:201,
                msg:"发送请求成功",
            })
        })
        .catch((e)=>{
            console.log(e.message);
            response.send({
                code:500,
                msg:e.message,
                errMsg:e
            })
        })
        .finally(()=>{
            prisma.$disconnect()
        })
})

//获取好友请求
router.get("/getFriReq",(request,response)=>{
    const { uid } = request.user
    getFriReq(uid)
        .then((res)=>{
            response.send({
                code:200,
                data:res,
                msg:"获取好友请求成功"
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
})

//成为好友
router.post("/agreeFriReq",(request,response)=>{
    const { frId } = request.body
    const { uid } = request.user
    // console.log(frId,uid);
    //发送的请求id在uid1,被动在uid2
    agreeFriReq(uid,frId)
        .then(()=>{
            response.send({
                code:200,
                msg:"成为好友"
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
})

router.get("/getMyFriend",(request,response)=>{
    const { uid } = request.user;
    getMyFriend(uid)
        .then((res)=>{
            response.send({
                code:200,
                data:res,
                msg:"获取好友成功"
            })
        })
        .catch((e)=>{
            response.send({
                code:500,
                msg:e.message
            })
        })
        .finally(()=>{
            prisma.$disconnect()
        })
})
module.exports=router