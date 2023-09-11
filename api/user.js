const { user } = require("../prisma");

const userSelect = {
    uid: true,
    username: true,
    gender: true,
    avatar: true,
    signature: true,
  }

//用户注册
function createUser({ username, password }) {
    return new Promise(async (resolve, reject) => {
        try {
            await user.create({
                data: {
                    username,
                    password
                }
            })
            resolve();
        } catch (error) {
            reject(error)
        }
    })
}

//用户登录
function login({ username, password }) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await user.findFirst({
                where: {
                    username,
                }
            });
            if (!result.username) {
                throw new Error("找不到该用户")
            }
            if (result.password !== password) {
                throw new Error("密码错误")
            }
            const data = await user.findFirst({
                where: {
                    username,
                },
            })
            delete data.password //删除密码属性
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

//修改用户性别
function update({ uid, value, type }) {
    const data = {};
    data[`${type}`] = value
    return new Promise(async (resolve, reject) => {
        try {
            await user.update({
                where: {
                    uid,
                },
                data: data
            })
            resolve();
        } catch (error) {
            reject(error)
        }
    })
}

//为进行有关user的某些功能所需额外的操作

// 用户之前注册查找是否重名
function findUser(username) {
    // console.log(username);
    return user.findMany({
        where: {
            username,
        },
        select:{
            uid:true,
            username:true,
            avatar:true,
            signature:true,
            gender:true,
        }
    });
}

function getUserInfo(uid){
    return new Promise(async (resolve,reject)=>{
        try {
            const result=await user.findFirst({
                where:{
                    uid,
                },
                select:userSelect
            })
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createUser,
    login,
    update,
    findUser,
    getUserInfo
}


