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
      const result = result1.concat(result2);
      result.sort((a, b) => b.time - a.time)//根据成为好友的时间排序
      resolve(result);
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
