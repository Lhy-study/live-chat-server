const server = require("./app");
const { Server } = require("socket.io")
const { sendChatInfo } = require("./api/chat");
const prisma = require("./prisma");
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        credentials: true
    }
});

// console.log('进来了');

io.on("connection",(socket)=>{

    // console.log(socket);
    //
    socket.on("joinSession",(convId)=>{
        console.log(convId);
        socket.join(convId)
    })


    socket.on("chatMsg", (convId,info)=>{
        // console.log("--------------");
        console.log(convId,info);
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
        console.log("--------------");
    })

    socket.on("disconnect",()=>prisma.$disconnect())
})



module.exports=io;