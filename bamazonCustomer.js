// Creating variables to require the needed node modules. 
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

// Connecting to mysql db. 
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'bamazon_DB'
});

// Connecting to mysql with it's built-in method. 
connection.connect(function(error) {
  if (error) throw error;
  welcomeToBamazon();
});

// Function for the first user prompt and to show the user the avaiable items from the mysql db (if they select "y").
function welcomeToBamazon() {
  inquirer.prompt([
    // Using inquirer to interact with the user on the command line. 
    {
      type: 'confirm',
      name: 'viewInventory',
      message: 'Welcome to Bamazon. Would you like to see our inventory?',
      default: true
    }
    // Using a promise to show the invetory or shoo the user away if they don't want to spend. 
  ]).then(function(userResponseOne) {
    if (userResponseOne.viewInventory === true) {
      // If the user choses yes, then show the table created below.
      showInventory();
    } else {
      console.log('Okey-Doke. Come back when you want to buy something.')
    }
  })
};

// This functions creates a nice looking table for the Bamazon invetory to be listed on and then displays it on the terminal. I npm installed the cli-table node module.  
function showInventory() {
  // Using cli-table's method to create a table (via constructor function). 
  var table = new Table({
    head: ['ITEM ID', 'PRODUCT NAME', 'DEPARTMENT NAME', 'ITEM PRICE', 'QUANTITY AVAILABLE'],
    colWidths: [10, 50, 30, 20, 20]
  });
  // Querying mysql for the inventory data. 
  connection.query('SELECT * FROM products', function(error, response) {
    if (error) throw error;
    console.log('Here is our current inventory')
      // looping through the array of objects from the response and pushing the values into the new table.
    for (var i = 0; i < response.length; i++) {
      table.push(
        [response[i].item_id, response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]
      );
    }
    // Calling on cli-table's method to console-log the table. 
    console.log(table.toString());
    transaction();
  });
};

function transaction() {
  inquirer.prompt([
    // Using inquirer to as the user to select an item id and the number of items they want to buy. 
    {
      type: 'input',
      name: 'itemId',
      message: 'Please select the ITEM ID.'
    },
    {
      type: 'input',
      name: 'numberOfItems',
      message: 'Please select the quantity you want to purchase.'
    }
    // Using a promise to query the database
  ]).then(function(userRespsonseTwo) {
    //
    connection.query('SELECT * FROM products WHERE item_id=?', userRespsonseTwo.itemId, function(error, response) {
      for (var i = 0; i < response.length; i++) {
        if (userRespsonseTwo.numberOfItems <= response[i].stock_quantity) {
          console.log(`We have your item(s) in stock. You selected the following:`)
          console.log(`Item Selected: ${response[i].product_name}`);
          console.log(`Department: ${response[i].department_name}`);
          console.log(`Price: ${response[i].price}`);
          console.log(`Number of Items: ${userRespsonseTwo.numberOfItems}`);
          console.log(`Total Purchase Price: ` + parseInt(userRespsonseTwo.numberOfItems) * parseFloat(response[i].price));
        } else {
          console.log(`Sorry, we don't have enough in stock to fill your order.`)
        }
      }
    });
  });
}