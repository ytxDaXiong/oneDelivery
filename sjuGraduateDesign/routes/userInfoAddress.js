var express = require('express');
var router = express.Router();

var mySQLClient = require('./mysql_util.js');
var mysqlClient = new mySQLClient();
mysqlClient.connect(function (err) {
	if (err) {
		console.log(err.stack);
	} else {
		// console.log('mysql connect success');
	}
});

router.get('/',function( req, res, next){
	if (req.session.user) {
		console.log("user_info_address:"+req.session.user);
		var user = req.session.user;
		mysqlClient.exec('SELECT * FROM delivery_user_address WHERE id = ?', [user.id], function(err, rows, field){
			if (err) {
				console.log(err.stack);
				var result = {
					code: 500,
					message: '服务端异常'
				}
				res.send(result);
			} else {
				console.log('select success');
				console.log(rows);
				if (rows.length > 0) {
					var result = {
						contact: rows[0].contact,
						tel: rows[0].tel,
						storeName: rows[0].store_name,
						address: rows[0].address
					};

					res.render('user_info_address',{result: result});
				} else {
					console.log("error, sql无此用户记录");
				}
			}
		});

	} else {
		console.log("session为空！");
	}
	
});


router.post('/infoModify',function(req, res, next) {
	console.log(req.body);
	if (req.session.user) {
		var user = req.session.user;
		var RB = req.body;
		mysqlClient.exec('UPDATE delivery_user_address SET contact = ?, tel = ?, store_name= ?, address = ?, notice = ? WHERE id = ?', [RB.contact,RB.tel,RB.storeName,RB.address,RB.notice,user.id], function(err, rows, field) {
			if (err) {
				console.log(er.stack);
				var result = {
					code: 500,
					message: '服务端异常'
				}
				res.send(result);
			} else {
				var result = {
					code: 200,
					message: '修改成功'
				}
				res.send(result);
			}
		})
	} else {
		console.log("session为空！");
	}

});
module.exports = router