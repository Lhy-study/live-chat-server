const mysql=require("mysql");

const pool=mysql.createPool({
    connectionLimit:100,
    host:"localhost",
    user:"root",
    password:"123456",
    database:"live_chat",
    charset:"utf8mb4"
});

const handleSql=(sql)=>{
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connection)=>{
            if (err) throw err;
            connection.query(sql,(e,rows)=>{//查询语句
                if(e){
                    reject(e);
                    connection.release();//释放连接池
                    throw e;
                }else{
                    resolve(rows);
                    connection.release();//释放连接池
                }
            });
        });
    });
};

module.exports = handleSql;