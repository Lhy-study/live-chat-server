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

//修改用户
function update({ uid, value :{ username, gender , signature }}) {
    // const data = {};
    // data[`${type}`] = value
    return new Promise(async (resolve, reject) => {
        try {
            const result = await user.update({
                where: {
                    uid,
                },
                data:{
                    username,
                    gender,
                    signature,
                }
            })
            delete result.password
            resolve(result);
        } catch (error) {
            reject(error)
        }
    })
}

function updateAvatar(uid,avatar){
    return new Promise(async (resolve, reject) => {
        try {
            const result = await user.update({
                where: {
                    uid,
                },
                data:{
                    avatar,
                }
            })
            delete result.password
            resolve(result);
        } catch (error) {
            reject(error)
        }
    })
}

function updatePassword(uid,password,newPsw){
    return new Promise(async (resolve,reject)=>{
        try {
            const result = await user.findUnique({
                where:{
                    uid,
                    password,
                }
            })
            if(result){
                await user.update({
                    where:{
                        uid,
                    },
                    data:{
                        password:newPsw
                    }
                })
                resolve()
            }else{
                throw new Error("原始密码不正确，请重试输入")
            }
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
    getUserInfo,
    updateAvatar,
    updatePassword,
}


