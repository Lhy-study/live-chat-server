const http=require("http");
const express=require("express");
const app=express();
const server=http.createServer(app)
const cors=require("cors");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./public"));//处理静态资源服务器;
app.use(cors({
    origin:["http://localhost:5173","http://127.0.0.1:5173"],
    credentials:true
}));
app.use("/",require("./route/index"));

/*
* 处理当请求到没有配置的路由时
* */
app.use((req,res)=>{
    res.status(404).send({
        code:404,
        msg:"您当前的路径找不到！"
    })
})


// app.listen(5000,()=>{
//     console.log('监听5000端口成功，express web服务器已经启动');
// });

server.listen(5000,()=>{
    console.log('监听5000端口成功，express web服务器已经启动');
})

// console.log(io);
module.exports=server
