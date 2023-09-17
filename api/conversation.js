const { conversation, chatInfo } = require("../prisma");

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
                }
            })
            if (result.length === 0) {
                const createResult = await conversation.create({
                    data: {
                        isGroup: false,
                        createTime: new Date(),
                        Users: {
                            connect: [
                                { uid: id1, },
                                { uid: id2 }
                            ]
                        }
                    }
                });
                resolve([createResult]);
            } else {
                resolve(result);
            }
        } catch (error) {
            reject(error)
        }
    })
}

//获取会话id
function getConverIdList(uid) {
    // console.log(uid);
    return new Promise(async (resolve, reject) => {
        try {
            const result = await conversation.findMany({
                where: {
                    isGroup: false,
                    AND: [
                        {
                            Users: {
                                some: {
                                    uid,
                                }
                            }
                        }
                    ]
                },
                include: {
                    Users: {
                        where: {
                            NOT: {
                                uid,
                            }
                        }
                    }
                }
            });
            // console.log(result, 91);

            // 使用 Promise.all 等待所有 chatInfo.findFirst 完成
            const promises = result.map((item) => {
                if (item.endChatId) {
                    return chatInfo.findFirst({
                        where: {
                            chatInfoId: item.endChatId
                        },
                        include: {
                            senderInfo: true
                        }
                    }).then((res) => {
                        item['endChat'] = res;
                    });
                }
            });

            // 等待所有 promises 执行完毕
            await Promise.all(promises);

            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


//获取某个会话的所有聊天信息
function getConverChatInfo(convId) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await conversation.findFirst({
                where: {
                    convId,
                },
                include: {
                    ChatInfos: {
                        include: {
                            senderInfo: {
                                select: userSelect
                            }
                        }
                    },
                    Users: true
                }
            })
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    startConversation,
    getConverIdList,
    getConverChatInfo,
}