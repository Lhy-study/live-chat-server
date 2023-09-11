const { friendShip, friendReq } = require("../prisma")

//不要拿到用户的密码
const userSelect = {
  uid: true,
  username: true,
  gender: true,
  avatar: true,
  signature: true,
}

//成为好友
function becomeFriend(uid1, uid2) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await friendShip.create({
        data: {
          id1: uid1,
          id2: uid2,
          time: new Date()
        }
      });
      resolve(result);
    } catch (error) {
      reject(error)
    }
  });
}

//获取某个用户的好友列表 ()
function getMyFriend(uid) {
  // console.log(uid);
  return new Promise(async (resolve, reject) => {
    try {
      const result1 = await friendShip.findMany({
        where: {
          id1: uid
        },
        //有select就不要include
        select: {
          id2User: {
            select: userSelect
          },
          time: true
        },
      });
      const result2 = await friendShip.findMany({
        where: {
          id2: uid,
        },
        select: {
          id1User: {
            select: userSelect
          },
          time: true
        },
      })
      // console.log(result1,result2);
      const arr=[]
      result1.forEach((item)=>{
        arr.push({
          time:item.time,
          user:item.id2User
        })
      })
      result2.forEach((item)=>{
        arr.push({
          time:item.time,
          user:item.id1User
        })
      })
      arr.sort((a, b) => b.time - a.time)//根据成为好友的时间排序
      resolve(arr);
    } catch (error) {
      reject(error)
    }
  });
}

//查看是不是自己的好友
function isFriend(myId, targetId) {
  return new Promise(async (resolve, reject) => {
    try {
      const result1 = await friendShip.findMany({
        where: {
          id1: myId,
          id2: targetId,
        }
      });
      const result2 = await friendShip.findMany({
        where: {
          id1: targetId,
          id2: myId,
        }
      });
      const isfriend = result1.length + result2.length === 0 ? false : true
      resolve(isfriend);
    } catch (error) {
      reject(error)
    }
  });
}

//发送好友请求
function sendReq(fromId, targetId) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await friendReq.findMany({
        where: {
          fromId,
          targetId,
        }
      });
      if (result.length != 0) {
        // console.log('您已经向该好友发起过请求了,请不要再发送了');
        throw new Error('您已经向该好友发起过请求了,请不要再发送了')
      }
      await friendReq.create({
        data: {
          fromId,
          targetId,
          startTime: new Date(),
        }
      })
      resolve()
    } catch (error) {
      reject(error)
    }
  });
}

//获取要加好友的请求(不分是否已经同意)
function getFriReq(uid) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await friendReq.findMany({
        where: {
          targetId: uid
        },
        include: {
          fromUser: {
            select: userSelect
          }
        }
      });
      resolve(result);
    } catch (error) {
      reject(error)
    }
  });
}

function agreeFriReq(uid,frId){
  return new Promise(async (resolve,reject)=>{
    try {
      const reqResult=await friendReq.findMany({
        where:{
          id:frId,
          targetId:uid
        }
      });
      if(reqResult == 0){
        throw new Error("您没有权限同意这条请求")
      }
      const result=await friendReq.update({
        where:{
          id:frId,
        },
        data:{
          isAgree:true,
          agreeTime:new Date()
        }
      });
      //看是否已经时好友关系了
      const isHave =await friendShip.findMany({
        where:{
          id1:reqResult[0].fromId,
          id2:uid
        }
      })
      if(isHave.length!=0){
        throw new Error("已经是好友关系了！")
      }
      await  friendShip.create({
        data: {
          id1: result.fromId,
          id2: result.targetId,
          time: new Date()
        }
      });
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

module.exports={
  becomeFriend,
  getFriReq,
  isFriend,
  sendReq,
  getFriReq,
  agreeFriReq,
  getMyFriend
}