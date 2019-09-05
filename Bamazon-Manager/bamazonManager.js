// Initializes the npm packages used
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// Initializes the connection variable to sync with a MySQL database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon"
});
// Creates the connection with the server and loads the manager menu upon a successful connection
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  loadManagerMenu();
});
// Get product data from the database
function loadManagerMenu() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
  
      // Load the possible manager menu options, pass in the products data
      loadManagerOptions(res);
    });
  }
  // Load the manager options and pass in the products data from the database
function loadManagerOptions(products) {
    inquirer
      .prompt({
        type: "list",
        name: "choice",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
        message: "What would you like to do?"
      })
      .then(function(val) {
        switch (val.choice) {
        case "View Products for Sale":
          console.table(products);
          loadManagerMenu();
          break;
          case "View Low Inventory":
          loadLowInventory();
          break;
          case "Add to Inventory":
          addToInventory(products);
          break;
        case "Add New Product":
          promptManagerForNewProduct(products);
          break;
        default:
          console.log("bye!");
          process.exit(0);
          break;
        }
      });
  }
  // Query the DB for low inventory products
function loadLowInventory() {
    // Selects all of the products that have a quantity of 5 or less
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res) {
      if (err) throw err;
      // Draw the table in the terminal using the response, load the manager menu
      console.table(res);
      loadManagerMenu();
    });
  }
  // Prompt the manager for a product to replenish
function addToInventory(inventory) {
    console.table(inventory);
    inquirer
      .prompt([
        {
          type: "input",
          name: "choice",
          message: "What is the ID of the item you would you like add to?",
          validate: function(val) {
            return !isNaN(val);
          }
        }
      ])
      .then(function(val) {
        var choiceId = parseInt(val.choice);
        var product = checkInventory(choiceId, inventory);
  
        // If a product can be found with the chose id...
        if (product) {
          // Pass the chosen product to promptCustomerForQuantity
          promptManagerForQuantity(product);
        }
        else {
          // Otherwise let the user know and re-load the manager menu
          console.log("\nThat item is not in the inventory.");
          loadManagerMenu();
        }
      });
  }
  // Ask for the quantity that should be added to the chosen product
function promptManagerForQuantity(product) {
    inquirer
      .prompt([
        {
          type: "input",
          name: "quantity",
          message: "How many would you like to add?",
          validate: function(val) {
            return val > 0;
          }
        }
      ])
      .then(function(val) {
        var quantity = parseInt(val.quantity);
        addQuantity(product, quantity);
      });
  }
  
  
  
  
  
  
  
  
  
  
