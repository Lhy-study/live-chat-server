const server = require("./app");
const { Server } = require("socket.io")
const { sendChatInfo } = require("./api/chat");
const { writeFile } = require("fs")
const { resolve , parse} = require("path")
const prisma = require("./prisma");
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        credentials: true
    },
    //限制buffer字节 1e6为1M
    maxHttpBufferSize:2e8
});
// console.log('进来了');

io.on("connection",(socket)=>{

    // console.log(socket);
    //
    socket.on("joinSession",(convId)=>{
        // console.log(convId);
        socket.join(convId)
    })

    //这里用作普通文本
    socket.on("chatMsg", (convId,info)=>{
        // console.log("--------------");
        // console.log(convId,info);
        const {  senderId , content , contentType} = info
        sendChatInfo({convId,senderId,content,contentType})
            .then((data)=>{
                console.dir(data);
                io.to(convId).emit('message',data)
            })
            .catch((err)=>{
                console.log(err);
            })
            .finally(()=>{
                prisma.$disconnect()
            })
        // console.log("--------------");
    })

    //这里是传输图片的
    socket.on("chatImg",(convId,info)=>{
        const {  senderId , content , originName ,contentType } = info
        const { ext }=parse(originName)
        const fileName=`${senderId+Date.now()}${ext}`
        // console.log(__dirname);
        const name=resolve(__dirname,`./public/chatImg/${fileName}`);
        writeFile(name,content,(err)=>{
            if(err){
                throw err
            }
        })
        sendChatInfo({convId,senderId,content:`/chatImg/${fileName}`,contentType})
            .then((data)=>{
                console.dir(data);
                io.to(convId).emit('message',data)
            })
            .catch((err)=>{
                console.log(err);
            })
            .finally(()=>{
                prisma.$disconnect()
            })
    })

    //传文件
    socket.on("chatFile",(convId,info)=>{
        const {  senderId , content , originName ,contentType } = info
        console.log(content);
        const { ext }=parse(originName)
        const fileName=`${senderId+Date.now()}${ext}`
        // console.log(__dirname);
        const name=resolve(__dirname,`./public/file/${fileName}`);
        writeFile(name,content,(err)=>{
            if(err){
                throw err
            }
        })
        sendChatInfo({convId,senderId,content:`/file/${fileName}`,contentType})
            .then((data)=>{
                console.dir(data);
                io.to(convId).emit('message',data)
            })
            .catch((err)=>{
                console.log(err);
            })
            .finally(()=>{
                prisma.$disconnect()
            })
    })

    socket.on("disconnect",()=>prisma.$disconnect())
})



module.exports=io;