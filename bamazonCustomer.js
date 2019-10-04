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
      name: 'confirmPurchase',
      message: 'Welcome to Bamazon. Would you like to see our inventory?',
      default: true
    }
    // Using a promise to show the invetory or shoo the user away if they don't want to spend. 
  ]).then(function(userResponse) {
    if (userResponse.confirmPurchase === true) {
      // If the user choses yes, then show the table created below.
      showInventory();
    } else {
      console.log('============================================================');
      console.log('Okey-Doke. Come back when you want to buy something.');
      console.log('============================================================');
      connection.end();
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
    console.log('=========================================================');
    console.log('Here is our current inventory.');
    console.log('=========================================================');
    // looping through the array of objects from the response and pushing the values into the new table.
    for (var i = 0; i < response.length; i++) {
      table.push(
        [response[i].item_id, response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]
      );
    }
    // Calling on cli-table's method to console-log the table. 
    console.log(table.toString());
    // Moving on to the transaction function. 
    transaction();
  });
};

// Tnis function completes the purchase and updates the mysql DB. 
function transaction() {
  inquirer.prompt([
    // Using inquirer to ask the user to select an item id and the number of items they want to buy. 
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
    // Using a promise to query the database.
  ]).then(function(userRespsonse) {
    // Using cli-table's npm pacakge to create a transaction summary for the user. 
    var tableTwo = new Table();
    // Querying the DB. If the user selected an item that's in stock, show the transaction table.
    connection.query('SELECT * FROM products WHERE item_id=?', userRespsonse.itemId, function(error, response) {
      for (var i = 0; i < response.length; i++) {
        // Calculating total purchase price. 
        var totalPurchasePrice = parseInt(userRespsonse.numberOfItems) * parseFloat(response[i].price);
        if (userRespsonse.numberOfItems <= response[i].stock_quantity) {
          console.log('============================================================');
          console.log(`We have your item(s) in stock. You selected the following:`);
          console.log('============================================================');
          // cli-table doing it's magic.
          tableTwo.push(
            // This is a vertical table format. 
            { 'Product Name:': response[i].product_name }, { 'Department Name:': response[i].department_name }, { 'Item Price:': response[i].price }, { 'Quantity Selected:': userRespsonse.numberOfItems }, { 'Total Purchase Price:': totalPurchasePrice });
          // Calling on cli-table's method to console-log the table. 
          console.log(tableTwo.toString());
          // Updating the database with the new stock_quantity value after the purchase. 
          var newStockQuantity = parseInt(response[i].stock_quantity) - parseInt(userRespsonse.numberOfItems);
          var userBoughtId = userRespsonse.itemId;
          // Calling the completeTransaction function and passing the updated stock quantity and the item the user selected as arguments. 
          completeTransaction(newStockQuantity, userBoughtId);
          // if the user selected an amount over what is in stock, she gets this message.
        } else {
          console.log('============================================================');
          console.log(`Sorry, we don't have enough in stock to fill your order.`);
          console.log('============================================================');
          welcomeToBamazon();
        };
      }
    });
  });
}

// This function asks the user to confirm and then updates the mysql DB if confirmed. 
function completeTransaction(newStockQuantity, userBoughtId) {
  inquirer.prompt([
    // Using inquirer to ask for confirmation. 
    {
      type: 'confirm',
      name: 'confirmPurchase',
      message: 'If you want to complete your purchase, please select "Yes".',
      default: true
    }
    // If the user confirms, then update the stock quantity.
  ]).then(function(userResponse) {
    if (userResponse.confirmPurchase === true) {
      // 
      connection.query('UPDATE products SET ? WHERE ?', [
          // Mapping stock_quantity and item_id so they can be updated in mysql. 
          {
            stock_quantity: newStockQuantity
          },
          {
            item_id: userBoughtId
          }
        ],
        function(error, response) {
          if (error) throw error;
        });
      // After a completed transaction, the user is taken back to the beginning. She then can see an updated products table. 
      console.log('============================================================');
      console.log('Your transaction is complete!')
      console.log('============================================================');
      welcomeToBamazon();
      // If the user changed her mind and does not what to complete the purchase, the connection ends.
    } else {
      console.log('Okey-Doke. Come back when you want to buy something.');
      connection.end();
    }
  })
};