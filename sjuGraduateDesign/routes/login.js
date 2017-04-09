//登录接口
var express = require('express');
// var userDao = require('../dao/userDao');//请求我们的数据处理包
var router = express.Router();
var sha = require('./degist_util.js');//加密
var mySQLClient = require('./mysql_util.js');
var mysqlClient = new mySQLClient();
mysqlClient.connect(function (err) {
	if (err) {
		console.log(err.stack);
	} else {
		// console.log('mysql connect success');
	}
});
/*user login*/
router.get('/', function(req, res, next) {
	res.render('login',{
	});
});

/* 执行登陆请求 必须是POST请求，因为涉及到密码 */
router.post('/', function(req, res, next) {
	console.log(req.body);
	var formData = req.body;
	console.log("username = " + formData.username);
	console.log("password = " + formData.password);
	var password_md5 = sha('md5', formData.password);
	console.log("password_md5 = " + password_md5);

	mysqlClient.exec('select * from delivery_user_address where store_user_name=? AND store_pwd=?', [formData.username,password_md5], function(err, rows, fields) {
		if (err) {
			console.log(err.stack);

			var error = {
				code: 500,
				message: '服务端异常'
			};
			res.send(error);
		} else {
			console.log('select * from delivery_user_address where store_user_name=?AND store_pwd=? success');

			if (rows.length == 0) {
				var error = {
					code: 400,
					message: '用户名或者密码错误'
				};
				res.send(error);
			} else {
				req.session.user = rows[0];
				console.log(req.session.user);
				console.log(req.session.user.contact);
				// res.cookie('userId', rows[0].id, {
				// 	maxAge: 30 * 60 * 1000,
    //                 path: '/',
    //                 httpOnly: true
				// });

                var success = {
                    code: 200,
                    message: '成功',
                    userId: rows[0].id,
                    storeName: rows[0].store_name,
                };

                res.send(success);
			}
		}
	});
});

module.exports = router;//对外提供路由