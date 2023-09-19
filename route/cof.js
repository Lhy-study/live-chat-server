const router = require("express").Router()
const prisma = require("../prisma");
const jwt = require("jsonwebtoken")
const { secretky } = require("../global")
const { addFCHasImg, 
        addFCNoImg ,
        getUserCOF,
    } = require("../api/friendCircle")
const { writeFile } = require("fs")
const { resolve, parse } = require("path")
const multer = require("multer");
const upload = multer()
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

//发表朋友圈
router.post("/addFC", upload.fields([{ name: "image[]" }, { name: "text" }]), (request, response) => {
    const { uid } = request.user;
    const { text } = request.body;
    const files = request.files

    // console.log(files['image[]'][0]);
    // console.log(text);
    if (files['image[]'].length) {
        const array = files['image[]'];
        let urls = [];
        array.forEach((element, index) => {
            const { ext } = parse(element.originalname);
            let fileName = `${uid}-${Date.now()}-${index + ext}`;
            let url = resolve(__dirname, `../public/COFImg/${fileName}`)
            // console.log(ext, fileName, url);
            urls.push(`/COFImg/${fileName}`)
            writeFile(url, element.buffer, err => {
                if (err) throw err
            })
        });
        addFCHasImg(uid, text, JSON.stringify(urls))
            .then(() => {
                response.send({
                    code: 200,
                    msg: "发表成功"
                })
            })
            .catch((e) => {
                response.send({
                    code: 500,
                    msg: e.message,
                    errMsg: e
                })
            }).finally(() => {
                prisma.$disconnect();
            })
        // console.dir(urls);
        // console.log(typeof JSON.stringify(urls));
        // console.log(JSON.stringify(urls));
    } else {
        addFCNoImg(uid, text)
            .then(() => {
                response.send({
                    code: 200,
                    msg: "发表成功"
                })
            })
            .catch((e) => {
                response.send({
                    code: 500,
                    msg: e.message,
                    errMsg: e
                })
            }).finally(() => {
                prisma.$disconnect();
            })
    }
});

//获取某个用户的朋友圈数据
router.post("/getgetUserCOF",(request,response)=>{
    const { uid } = request.body;
    getUserCOF(uid)
        .then((data)=>{
            response.send({
                code:200,
                data,
                msg:"获取这名用户的朋友圈数据成功"
            })
        })
        .catch((e) => {
            response.send({
                code: 500,
                msg: e.message,
                errMsg: e
            })
        }).finally(() => {
            prisma.$disconnect();
        })

})

module.exports = router