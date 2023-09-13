const { conversation  } = require("../prisma");

const userSelect = {
    uid: true,
    username: true,
    gender: true,
    avatar: true,
    signature: true,
}

//首先要找
function startConversation(id1, id2) {
    return new Promise(async (resolve, reject) => {
        // console.log(id1,id2);
        try {
            const result = await conversation.findMany({
                where: {
                    isGroup: false,
                    AND: [
                        {
                            Users: {
                                some: {
                                    uid: id1
                                }
                            }
                        },
                        {
                            Users: {
                                some: {
                                    uid: id2
                                }
                            }
                        },
                    ]
                },
                include: {
                    Users: true,
                    endChat:true,
                }
            })
            if(result.length===0){
                const createResult=await conversation.create({
                    data:{
                        isGroup:false,
                        createTime:new Date(),
                        Users:{
                            connect:[
                                {uid:id1,},
                                {uid:id2}
                            ]
                        }
                    }
                });
                resolve(createResult);
            }else{
                resolve(result);
            }   
        } catch (error) {
            reject(error)
        }
    })
}

//获取会话id
function getConverIdList(uid){
    return new Promise(async(resolve,reject)=>{
        try {
            const result =await conversation.findMany({
                where:{
                    isGroup:false,//代表着不是群聊，封面为对方的头像
                    AND:[
                        {
                            Users:{
                                some:{
                                    uid,
                                }
                            }
                        }
                    ]
                },
                include:{
                    endChat:{
                        select:{
                            sendTime:true,
                            content:true,
                            contentType:true,
                            senderInfo:{
                                select:{
                                    uid:true,
                                    username:true
                                }
                            }
                        }
                    },
                    //这里要把非自己的用户当做会话封面
                    Users:{
                        where:{
                            NOT:{
                                uid,
                            }
                        }
                    }
                }
            })
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

//获取某个会话的所有聊天信息
function getConverChatInfo(convId){
    return new Promise(async (resolve,reject)=>{
        try {
            const result = await conversation.findFirst({
                where:{
                    convId,
                },
                include:{
                    ChatInfos:{
                        include:{
                            senderInfo:{
                                select:userSelect
                            }
                        }
                    },
                    Users:true
                }
            })
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports={
    startConversation,
    getConverIdList,
    getConverChatInfo,
}