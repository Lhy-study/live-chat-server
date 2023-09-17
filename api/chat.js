const { chatInfo , conversation} = require("../prisma");

const userSelect = {
    uid: true,
    username: true,
    gender: true,
    avatar: true,
    signature: true,
}

//获取某个会话的所有消息
function getChatInfoList(convId) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await chatInfo.findMany({
                where: {
                    convId,
                },
                include: {
                    senderInfo: {
                        select: userSelect
                    }
                }
            });
            resolve(result)
        } catch (error) {
            reject(error)
        }
    });
}

//发送
function sendChatInfo({convId,senderId,content,contentType}) {
    return new Promise(async (resolve,reject)=>{
        try {
            const result1=await chatInfo.create({
                data:{
                    convId,
                    senderId,
                    content,
                    sendTime:new Date(),
                    contentType,
                }
            })
            const data = await chatInfo.findFirst({
                where: {
                    chatInfoId:result1.chatInfoId
                },
                include: {
                    senderInfo: {
                        select: userSelect
                    }
                }
            });
            await conversation.update({
                where:{
                    convId,
                },
                data:{
                    // endChat:{
                    //     ...data
                    // },
                    endChatId:data.chatInfoId
                }
            })
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}


module.exports={
    getChatInfoList,
    sendChatInfo,
}