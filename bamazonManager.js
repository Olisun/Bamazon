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
  welcomeBamManager();
});

// Function for the first manager prompt and to show the manager the list of options.
function welcomeBamManager() {
  inquirer.prompt([
    // Using inquirer to interact with the manager on the command line. 
    {
      type: 'list',
      name: 'managerList',
      message: 'Please select from the following menu.',
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit Application']
    },
    // Using a promise to code logic for what the app should do when the manager selects a specific view. 
  ]).then(function(managerResponse) {
    // Using a switch-case to define each action. 
    switch (managerResponse.managerList) {
      case 'View Products for Sale':
        showInventory();
        break;
      case 'View Low Inventory':
        lowInventory();
        break;
      case 'Add to Inventory':
        addToInventory();
        break;
      case 'Add New Product':
        addNewInventory();
        break;
      case 'Exit Application':
        connection.end();
        break;
    }
  })
};

// This functions creates a nice looking table for the Bam Manager to see the inventory. I npm installed the cli-table node module.  
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
    welcomeBamManager();
  });
};

// Tnis function shows the same products table but with only the products that lave a stock quantity count of 3 or less. 
function lowInventory() {
  // Using cli-table's method to create a table (via constructor function). 
  var table = new Table({
    head: ['ITEM ID', 'PRODUCT NAME', 'DEPARTMENT NAME', 'ITEM PRICE', 'QUANTITY AVAILABLE'],
    colWidths: [10, 50, 30, 20, 20]
  });
  // Querying mysql for the inventory data. 
  connection.query('SELECT * FROM products', function(error, response) {
    if (error) throw error;
    console.log('=========================================================');
    console.log('We are low on the following products.');
    console.log('=========================================================');
    // looping through the array of objects from the response and pushing the values into the new table.
    for (var i = 0; i < response.length; i++) {
      // if the stock quantity is 3 or less, execute the code below. 
      if (response[i].stock_quantity <= 3) {
        // Pushing only items with stock quantity count of 3 or less.
        table.push(
          [response[i].item_id, response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]
        );
      }
    }
    // Calling on cli-table's method to console-log the table. 
    console.log(table.toString());
    welcomeBamManager();
  });
};

// This function asks the Bam-Man(Woman) what inventory item she wishes to add to and then adds the amount entered to the currently stock quantity value in mysql. 
function addToInventory() {
  inquirer.prompt([
    // Using inquirer to ask for and record input from the Bam-Man(Woman).
    {
      type: 'input',
      name: 'itemId',
      message: 'Please select the ITEM ID of the low inventory product.'
    },
    {
      type: 'input',
      name: 'numberOfItems',
      message: 'Please select the quantity you want add to the current stock quantity.'
    }
  ]).then(function(managerResponse) {
    // Querying the mysql DB to target the low inventory item. 
    connection.query('SELECT * FROM products', function(error, response) {
      // creating a variable for the low inventory item the Bam-Man/Woman selects. 
      //
      for (var i = 0; i < response.length; i++) {
        var lowInventoryItem;
        // if the inventory item_id equals the number the Bam-Man/Woman selects, then that is the item to be updated. ParseInting the BMW's input to a number. 
        if (response[i].item_id === parseInt(managerResponse.itemId)) {
          lowInventoryItem = response[i];
        };
      };
      // Setting the new Stock Qty to the current stock_quantity in the mysql DB plus the BMW's input for how many new items to add to that stock item. 
      var newStockQuantity = parseInt(lowInventoryItem.stock_quantity) + parseInt(managerResponse.numberOfItems);
      console.log('=========================================================');
      console.log(`Number of new units being added to this item: ${managerResponse.numberOfItems}.`);
      console.log('=========================================================');
      console.log(`New item count: ${newStockQuantity}.`);
      console.log('=========================================================');
      // Updating mysql DB. 
      connection.query('UPDATE products SET ? WHERE ?', [
          //
          {
            stock_quantity: newStockQuantity
          },
          {
            item_id: managerResponse.itemId
          }
        ],
        function(error, response) {
          if (error) throw error;
        });
      // After a adding to lowInventory, the BMW is taken back to the beginning. She then can see an updated products table. 
      console.log('============================================================');
      console.log('Your inventory update is complete!')
      console.log('============================================================');
      welcomeBamManager();
    });
  });
};

// Tnis function allows ther BMW to add a new product. 
function addNewInventory() {
  inquirer.prompt([
    // Using inquirer for the new product info. 
    {
      type: 'input',
      name: 'itemID',
      message: 'Please enter a 2-digit item ID.'
    },
    {
      type: 'input',
      name: 'product',
      message: 'What is the name of the new product?'
    },
    {
      type: 'input',
      name: 'department',
      message: 'What department should it go into?'
    },
    {
      type: 'input',
      name: 'price',
      message: 'What is the price of the new product?'
    },
    {
      type: 'input',
      name: 'quantity',
      message: 'How many units are you adding?'
    }
  ]).then(function(managerResponse) {
    // Querying the mysql DB to insert the new product data to a new row. 
    connection.query('INSERT INTO products SET ?',
      // passing an the new product info (as an object) as an argument in the comnnection.query method. 
      {
        item_id: managerResponse.itemID,
        product_name: managerResponse.product,
        department_name: managerResponse.department,
        price: managerResponse.price,
        stock_quantity: managerResponse.quantity
      },
      function(error, response) {
        if (error) throw error;
      });
    console.log('============================================================');
    console.log('Your new product has been added to the products database.')
    console.log('============================================================');
    welcomeBamManager();
  });
};