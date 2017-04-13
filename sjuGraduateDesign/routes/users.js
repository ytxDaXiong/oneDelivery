var express = require('express');
var router = express.Router();
var formidable = require('formidable');
const fs = require('fs');

var mySQLClient = require('./mysql_util.js');
var mysqlClient = new mySQLClient();
mysqlClient.connect(function (err) {
  if (err) {
    console.log(err.stack);
  } else {
    // console.log('mysql connect success');
  }
});
/* GET users listing. */
/*me page*/
router.get('/me', function(req, res, next) {
  var RSU = req.session.user;
  var userAvatar = RSU.avatar;
  var contact = RSU.contact;
  var storeName = RSU.store_name;
  var address = RSU.address;

  var userInfo = {
    contact: contact,
    storeName: storeName,
    address:address
  }

  if (userAvatar) {
    console.log("userAvatar:"+userAvatar);
    var avatar = userAvatar.substring(userAvatar.indexOf("/"),userAvatar.length);
    console.log("avatar:"+avatar);
    res.render('me', {avatar: avatar,userInfo:userInfo});
    return;
  } else {
    res.render('me', {avatar: null,userInfo:userInfo});
    return;
  }
  
 
});

var cacheFolder = 'public/images/uploadcache/';
router.post('/upload', function(req, res, next) {
	console.log(req.body,"session"+req.session);
  var currentUser = req.session.user;
  var userDirPath = cacheFolder + currentUser.id;
  console.log(currentUser.id);
  if (!fs.existsSync(userDirPath)) {
  	fs.mkdirSync(userDirPath);
  }
  var form = new formidable.IncomingForm(); //创建上传表单
  form.encoding = 'utf-8';//设置编辑
  form.uploadDir = userDirPath;//设置上传目录
  form.keepExtensions = true;//保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024;//文件大小
  form.type = true;
  // var UPLOAD_FOLDER = '/uploadcache';
  var displayUrl;
  form.parse(req, function(err, fields, files) {
  	if (err) {
  		res.send(err);
  		return;
  	}
  	var extName = '';//后缀名
  	switch(files.upload.type) {
  		case 'image/pjpeg':
  			extName = 'jpg';
  			break;
  		case 'image/jpeg':
  			extName = 'jpg';
  			break;
  		case 'image/png':
  			extName = 'png';
  			break;
  		case 'image/x-png':
  			extName = 'png';
  			break;
  	}

  	if (extName.length === 0) {
  		res.send({
  			code: 202,
  			message: '只支持png和jpg格式图片'
  		});
  		return;
  	} else {
  		var avatarName = '/' + Date.now() + '.' + extName;
  		var newPath = form.uploadDir + avatarName;
      console.log(newPath);
  		// displayUrl = UPLOAD_FOLDER + currentUser.id + avatarName;
  		fs.renameSync(files.upload.path, newPath);//重命名
    //   currentUser.defaultAvatar = newPath;
    //   console.log(currentUser.defaultAvatar);
     var userInfo = req.session.user;
      mysqlClient.exec('UPDATE delivery_user_address SET avatar = ? WHERE id = ?', [newPath, userInfo.id], function(err, rows, fields){
        if (err) {
          console.log(err.stack);
          var result = {
              code: 400,
              message: "UPDATE ERROR"
          }
          res.send(result);
          return;

        } else {
          console.log("update info success");
          var result = {
              code: 200,
              message: "更新用户头像成功",
              displayUrl:newPath
          }

          var rsUser = req.session.user;
          if (rsUser) {
            rsUser.avatar = newPath;
          }
          res.send(result);
        }
      });
  		
  	}
  });
});

module.exports = router;
