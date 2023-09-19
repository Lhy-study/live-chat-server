const router = require("express").Router();
const prisma = require("../prisma");
const {
    createUser,
    update,
    login,
    findUser,
    getUserInfo,
    updateAvatar,
    updatePassword
} = require("../api/user");
const jwt = require("jsonwebtoken");
const { secretky } = require("../global");
const multer = require("multer");
const { writeFile } = require("fs")
const { parse, resolve } = require("path")

const upload = multer();

//用户注册 1.首先要格式校验
router.post("/register", async (request, response) => {
    const { username, password } = request.body;
    const result = await findUser(username);
    if (!(/^[\u4e00-\u9fa5a-zA-Z0-9]{1,7}$/.test(username) && /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/.test(password))) {
        response.send({
            code: 400,
            msg: "请检查用户名或者密码是否符合规范",
        });
    } else if (result.length) {//代表已经有用户了
        response.send({
            code: 405,
            msg: "用户已经存在,请换个用户名"
        })
    } else {
        createUser({ username, password })
            .then(() => {
                response.send({
                    code: 201,
                    msg: "注册成功，请返回登录页登录"
                })
            })
            .catch(() => {
                response.send({
                    code: 500,
                    msg: "注册失败，请稍后重试"
                })
            })
            .finally(() => {
                prisma.$disconnect();
            })
    }
})

//用户登录
router.post("/login", (request, response) => {
    const { username, password } = request.body
    login({ username, password })
        .then((data) => {
            const token = jwt.sign(data, secretky, { expiresIn: "7d" });
            response.send({
                code: 200,
                msg: "登录成功",
                data,
                token,
            })
        })
        .catch((e) => {
            console.log(e);
            response.send({
                code: 400,
                msg: "e"
            });
        })
        .finally(() => {
            prisma.$disconnect();
        })
});

//持久化登录
router.get("/isLogin", (request, response) => {
    const token = request.headers['authorization'];

    if (token) {
        jwt.verify(token, secretky, (err, user) => {
            if (err) {
                response.send({
                    code: 401,
                    msg: "您没有该权限",
                    e: err
                });
            } else {
                response.send({
                    code: 200,
                    msg: "登录成功",
                    data: user
                });
            }
        })
    } else {
        response.send({
            code: 404,
            data: { uid: NaN },
            msg: "登录失败"
        });
    }
});

//查看是否有权限
router.use((request, response, next) => {
    const token = request.headers['authorization']; //获取到存储到客户端的token;
    if (token) {
        jwt.verify(token, secretky, (e, user) => {
            // console.log(user);
            if (e) {
                response.send({
                    code: 401,
                    msg: "很抱歉，您还没有登录，登录后方可进行"
                });
            } else {
                request.user = user;
                next();
            }
        });
    } else {
        response.send({
            code: 401,
            msg: "很抱歉，您还没有登录过"
        })
    }
});

//用户修改信息(不包括密码、头像)
router.post("/update/", (request, response) => {
    const { uid, value } = request.body;
    console.log(uid, value);
    update({ uid, value })
        .then((data) => {
            const token = jwt.sign(data, secretky, { expiresIn: "7d" })
            response.send({
                code: 200,
                msg: "修改成功",
                data,
                token,
            })
        })
        .catch((e) => {
            response.send({
                code: 500,
                msg: e.message,
                errMsg: e
            })
        })
        .finally(() => {
            prisma.$disconnect();
        })
});

//这里使用formdata格式传输
router.post("/update/avatar", upload.fields([{ name: "avatar" }, { name: "uid" }]), (request, response) => {
    // console.log(request.files.avatar[0]);
    // console.log(request.body);
    const file = request.files.avatar[0];
    const { buffer, originalname } = file;
    const uid = parseInt(request.body.uid) //因为前端经过formdata的值必须是字符串，所有进行转化变为数字
    const user = request.user;
    if (uid !== user.uid) {
        response.send({
            code: 401,
            msg: "您没有权限修改这个用户信息"
        });
        return
    }

    const { ext } = parse(originalname);
    const fileName = `${uid + Date.now() + ext}`;
    writeFile(resolve(__dirname, `../public/avatar/${fileName}`), buffer, (err) => {
        if (err) throw err
        console.log(resolve(__dirname, `../public/avatar/${fileName}`));
    })

    updateAvatar(uid, `/avatar/${fileName}`)
        .then((data) => {
            const token = jwt.sign(data, secretky, { expiresIn: "7d" })
            console.log(token,data);
            response.send({
                code: 200,
                data,
                msg: "头像修改成功",
                token
            })
        })
        .catch((e) => {
            response.send({
                code: 500,
                msg: e.message,
                errMsg: e
            })
        })
        .finally(() => {
            prisma.$disconnect();
        })
});

router.post("/update/password", (request, response) => {
    const { uid, password, newPsw } = request.body;
    // console.log(typeof uid,typeof request.user.uid , uid, request.user.uid);
    if(uid!==request.user.uid){
        response.send({
            code: 401,
            msg: "您没有权限修改这个用户信息"
        });
        return
    }

    updatePassword(uid,password,newPsw)
        .then(()=>{
            response.send({
                code:200,
                msg:"密码修改成功"
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
            prisma.$disconnect();
        })
})

//搜索用户
router.post("/search", (request, response) => {
    const { username } = request.body;
    findUser(username)
        .then((res) => {
            response.send({
                code: 200,
                data: res,
                msg: "搜素用户成功"
            })
        })
        .catch((e) => {
            response.send({
                code: 500,
                msg: "请稍后重试",
                errMsg: e
            })
        })
        .finally(() => {
            prisma.$disconnect();
        })
});

//获取用户信息
router.post("/getUserInfo", (request, response) => {
    const { uid } = request.body;
    getUserInfo(uid)
        .then((data) => {
            response.send({
                code: 200,
                msg: "获取好友信息成功",
                data
            })
        })
        .catch((e) => {
            response.send({
                code: 500,
                msg: e.message,
                errMsg: e
            })
        })
        .finally(() => {
            prisma.$disconnect()
        })
})

module.exports = router