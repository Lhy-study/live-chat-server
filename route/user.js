const router = require("express").Router();
const prisma = require("../prisma");
const { createUser, update, login, findUser } = require("../api/user");
const jwt = require("jsonwebtoken");
const { secretky } = require("../global");

//用户注册 1.首先要格式校验
router.post("/reg", async (request, response) => {
    const { username, password } = request.body;
    const result = await findUser(username);
    if (/^[\u4e00-\u9fa5a-zA-Z0-9]{1,7}$/.test(username) && /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/.test(password)) {
        response.send({
            code: 400,
            msg: "请检查用户名或者密码是否符合规范",
        });
    }else if (result.length) {//代表已经有用户了
        response.send({
            code: 405,
            msg: "用户已经存在,请换个用户名"
        })
    } else {
        createUser({username,password})
            .then(()=>{
                response.send({
                    code:201,
                    msg:"注册成功，请返回登录页登录"
                })
            })
            .catch(()=>{
                response.send({
                    code:500,
                    msg:"注册失败，请稍后重试"
                })
            })
            .finally(()=>{
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

//用户修改信息(不包括密码、头像)
router.post("/update/:type", (request, response) => {
    const { uid, value } = request.body;
    const type = request.params.type;
    update({ uid, value, type })
        .then
});

module.exports = router