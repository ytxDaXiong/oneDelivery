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

router.get('/list',function(req, res, next) {
	console.log(req.query.recordId);
	if (req.query.recordId) {
		mysqlClient.exec('SELECT * FROM express_record WHERE id = ?', [req.query.recordId], function(err, rows, field){
			if (err) {
				console.log(err.stack);
				var result = {
					code: 400,
					message: '服务端异常'
				}
				res.send(result);
				return;
			} else {
				if (rows.length == 0) {
					var result = {
						code: 200,
						message: '无此条记录,请检查参数'
					}
					res.send(result);
					return;
				} else {
					// var expressRecord = {'detailInfo':rows[0]};
					// console.log("物流详细信息:"+JSON.stringify(expressRecord));
					console.log(rows[0]);
					switch (rows[0].status) 
					{
						case "waiting":
							rows[0].status = "未发货";
							break;
						case "accepted":
							rows[0].status = "已收货";
							break;
						case "delivered":
							rows[0].status = "已发货";
							break;
						case "accounted":
							rows[0].status = "已核账";
							break;
					}
					res.render('detailInfo',{detailInfo: rows[0]});
				}
			}
		})
	} else {
		console.log("req.query为空");
	}
	
	
});


module.exports = router; 