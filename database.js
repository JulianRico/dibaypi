const mysql = require('mysql');
const fs = require('fs');

/*const mysqlConnection =  mysql.createPool({host: "vitahome.mysql.database.azure.com", user: "mysqladmin@vitahome", password: "VitaHome2019", database: "vitahome", port: 3306, ssl  : {
  ca : fs.readFileSync(__dirname + '/BaltimoreCyberTrustRoot.crt.pem')
}}); */


//const mysqlConnection = mysql.createPool({host: "localhost", user: "root", password: "password", database: "vitahome_v2", port: 3306}); 


/* 
const mysqlConnection = mysql.createPool({
  connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
   host: "160.153.58.38", 
   user: "vitahomeMysqlAdm", 
   password: "password", 
   database: "vitapro" 
  });  
 */
 
 
 
 const mysqlConnection = mysql.createPool({connectionLimit : 100, host: "35.238.146.63", user: "julian", password: "14703939.Julian", database: "dbdibay"});  
 
// const mysqlConnection = mysql.createPool({connectionLimit : 1000, host: "database-1.ctleg9gqae8v.us-east-2.rds.amazonaws.com", user: "root", password: "password", database: "vitahome"}); 
 
module.exports = mysqlConnection;

