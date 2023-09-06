const prisma = require("../prisma");
// map.set(name1,'username');

用户注册
function createUser({username,username}){
    return new Promise((resolve,reject)=>{
        try {
            prisma.user.create({
                data:{
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

修改用户性别
function updateGender({ uid, value, type }) {
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


