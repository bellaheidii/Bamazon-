//npm packages 
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

//connection to sync with Mysql
var connection = mysql.createConnection({
    host: "local host",


port: 3306, 

user: "root",

password: "password",
database: "bamazon",

});