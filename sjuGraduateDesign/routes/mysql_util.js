/**
 * mysql的帮助工具
 */

var config = require('../config/config');
var mysql = require('mysql');

function MySQLClient() {

    var connection;

    MySQLClient.prototype.connect = function(callback) {
        connection = mysql.createConnection(config.db);
        connection.connect(callback);
    };

    MySQLClient.prototype.exec = function(sql, values, callback) {
        if (connection) {
            // console.log(sql);
            connection.query(sql, values, callback);
        } else {
            console.log("mysql is unconnection");
        }
    };

    MySQLClient.prototype.end = function(callback) {
        if (connection) {
            connection.end(callback);
        } else {
            console.log("mysql is unconnection");
        }
    }
}

module.exports = MySQLClient;
