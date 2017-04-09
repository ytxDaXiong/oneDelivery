// //登录

// var connection = require("../config/config");//获取数据库连接
// var md5 = require('../public/javascripts/md5.js');

// var login = function(username,password,callback) {
// 	var data = "";
// 	connection.getConnection.query('select * from delivery_user where agent_user_name = "'+username+'";',function(error,rows,fields){
// 		if (rows.length == 0) {
// 			data.type = "fail";
// 			data.message = "用户名不存在！";
// 				callback(data);
// 		} else {
// 			if (rows[0].agent_pwd == password) {
// 				data.type = "success";
// 				data.message = "登录成功！";
// 				callback(data);
// 			} else {
// 				data.type = "fail";
// 				data.message = "密码错误！";
// 				callback(data);
// 			}
// 		}
// 	});

// }

// exports.login = login;//对外暴露我们的login方法