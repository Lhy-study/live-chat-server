const prisma = require("../prisma");


//用户注册
function createUser({ username, password }) {
    return new Promise(async (resolve, reject) => {
        try {
            await prisma.user.create({
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
            const result = await prisma.user.findFirst({
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
            const data = await prisma.user.findFirst({
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
            await prisma.user.update({
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
    return prisma.user.findMany({
        where: {
            username,
        }
    });
}

module.exports = {
    createUser,
    login,
    update,
    findUser
}


