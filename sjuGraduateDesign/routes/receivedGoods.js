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

router.get('/receivedGoods', function(req, res, next) {
	console.log(req);
});

router.post('/receivedGoods', function(req, res, next) {
	console.log("it is receivedGoods post way");
	console.log(req.body);
	var id = req.body.id;
	var deli_type = req.body.delivery_type;
	var receivedTime = req.body.receivedTime;
	console.log(id,deli_type,receivedTime);
	if (req.body) {
		mysqlClient.exec('UPDATE express_record SET accepted_time = ?, status = "accepted" WHERE id = ?', [receivedTime,id], function(err, rows, fields) {
			if (err) {
				console.log(111);
				console.log(err.stack);
				var error = {
					code: 500,
					message: '服务端异常'
				};
				res.send(error);
			} else {
				console.log("update success");
				var success = {
					code: 200,
					message: '签收成功'
				};
				res.send(success);

			}
		})
	}

});

module.exports = router;