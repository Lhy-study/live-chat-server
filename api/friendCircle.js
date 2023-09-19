const { circleOfFriends, otherFiles } = require("../prisma")
const { userSelect } = require("../global")

/**  有图片等其他文件的情况下
 *  // 思路 ：先将文字添加到朋友圈表，生后的的数据拿到朋友圈id,
 * 然后拿这个id去创建除文本外的朋友圈附加表 OtherFiles
 * 再然后修改朋友圈表
 * @param {*} userId 
 * @param {*} text 
 * @param {*} url 
 * @returns 
 */
function addFCHasImg(userId, text, url) {
    return new Promise(async (resolve, reject) => {
        try {
            const result1 = await circleOfFriends.create({
                data: {
                    text,
                    userId,
                    time: new Date()
                }
            })
            // console.log(url);
            const result2 = await otherFiles.create({
                data: {
                    otherType: "IMG",
                    otherValue: url,
                    COFId: result1.cirFriId
                }
            })
            await circleOfFriends.update({
                where: {
                    cirFriId: result1.cirFriId
                },
                data: {
                    otherId: result2.otherId
                }
            })
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

/**没有图片
 *  
 * @param {*} userId 
 * @param {*} text 
 * @returns 
 */
function addFCNoImg(userId, text) {
    return new Promise(async (resolve, reject) => {
        try {
            await circleOfFriends.create({
                data: {
                    userId,
                    text,
                    time: new Date()
                }
            })
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}
/**
 *  获取某个用户的朋友圈
 * @param {*} userId 
 * @returns 
 */
function getUserCOF(userId) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await circleOfFriends.findMany({
                where:{
                    userId,
                },
                include:{
                    userInfo:{
                        select:userSelect
                    },
                    other:{
                        select:{
                            otherId:true,
                            otherType:true,
                            otherValue:true
                        }
                    },
                    COFMessages:{
                        include:{
                            userInfo:{
                                select:userSelect
                            }
                        }
                    }
                }
            });
            resolve(auxiliaryFn(result))
        } catch (error) {
            reject(error)
        }
    })
}

// getCOF(1)
//     .then((res)=>{
//         // console.dir(res);
//         // console.log();
//         console.dir(res);
//     })

//辅助函数 用于处理不同文件 ,只有图片文件才会能有多个 ，所以只需判断其他文件数据类型是不是图片即可
function auxiliaryFn(res){
    if(res.length){
        res.forEach(item => {
            //是图片类型·
            if(item.other && item.other.otherType === 'IMG'){
                item.other.otherValue=JSON.parse(item.other.otherValue)
            }
        });
        return res
    }else{
        return res
    }
}

module.exports = {
    addFCHasImg,
    addFCNoImg,
    getUserCOF,
}

