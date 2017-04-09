//注册
var connection = require("../config/config");

var regist = function(username,password,callback){
	var data = "";
	connection.getConnection.query("insert into delivery_user(agent_user_name,agent_pwd) values('"+username+"','"+password+"');",function(error,rows,fields){
		if (rows!=undefined) {
			data.type = 'success';
			data.message = '注册成功！';
			callback(data);
		} else {
			data.type = 'fail';
			data.message = '手机号输入错误!';
			callback(data);
		}
	});
}


exports.regist = regist;