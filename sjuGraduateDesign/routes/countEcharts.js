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

router.get('/',function(req,res,next){
	if (req.session.user) {
		var user = req.session.user;
		console.log(user);
		mysqlClient.exec('SELECT COUNT(ER.express_code = "ex_100" OR NULL) AS count_100,COUNT(ER.express_code = "ex_101" OR NULL) AS count_101,COUNT(ER.express_code = "ex_102" OR NULL) AS count_102,COUNT(ER.express_code = "ex_103" OR NULL) AS count_103,COUNT(ER.express_code = "ex_104" OR NULL) AS count_104,COUNT(ER.express_code = "ex_105" OR NULL) AS count_105 from express_record AS ER WHERE contact = ?',[user.contact],function(err, rows, field){
			if (err) {
				console.log(err.stack);
				var result = {
					code: 500,
					message: "服务器异常"
				}
				res.send(result);
			} else {
				console.log("SELECT COUNT express_code SUCCESS");
				console.log(rows);
				var expressCount = rows;
				mysqlClient.exec('SELECT COUNT( express_record.`status` = "accepted" OR NULL) AS acNum,COUNT( express_record.`status` = "delivered" OR NULL) AS deNum  FROM express_record WHERE contact = ?', [user.contact], function(err, rows, field){
					if (err) {
						console.log(err.stack);
						var result = {
							code: 500,
							message: "服务器异常"
						}
						res.send(result);
					} else {
						console.log("SELECT COUNT status SUCCESS");
						console.log(rows);
						var statusCount = rows;
						res.render('count_echarts',{express_count: expressCount,status_count: statusCount});
					}
				})
				
			}
		});
	}
	

	
});





module.exports = router;