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

//connection with the server and loads product data upon successful connection 
connection.connect(function(err) {
    if(err) {
        console.error("error connecting: " + err.stack); 
    }
    loadProducts();
})

//loads products from database and prints results 
function loadProducts(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        //Draw the table in the terminal using response 
        console.table(res);

        //then prompt the customer for thier choice of product, pass all the products to promptCustomerForItem
        promptCustomeForItem(res);
    });
}