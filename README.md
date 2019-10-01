# Bamazon
Node.js &amp; MySQL Homework Assignment

## Screen Shot of App Cycle:
![](images/screen-shot-main.png)
![](images/screen-shot-default.png)

## Link to Video on Github Pages:

https://olisun.github.io/liri-node-app/index.html

## User Instructions:


## About the project:
We are tasked with creating an Amazon-like storefront with the MySQL, Node.js, JavaScript, npm Inquirer and MySql Workbench. The app will take in orders from customers and deplete stock from the store's inventory. Bonus tasks include tracking product sales across the store's departments and providing a summary of the highest-grossing departments in the store.

## MVP Objectives:

1. Create a MySQL Database called bamazon.

2. Create a Table inside of that database called products.

3. The products table should have each of the following columns:
   
    * item_id (unique id for each product)
    * product_name (Name of product)
    * department_name
    * price (cost to customer)
    * stock_quantity (how much of the product is available in stores)

4. Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).

5. Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

6. The app should then prompt users with two messages.
   
    * The first should ask them the ID of the product they would like to buy.
    * The second message should ask how many units of the product they would like to buy.

7. Once the customer has placed the order, the application should check if the store has enough of the product to meet the customer's request.
  
    * If not, the app should log a phrase like Insufficient quantity!, the order will be prevented from going through.

8. However, if the store does have enough of the product, the app will fulfill the customer's order.
   
    * This means updating the SQL database to reflect the remaining quantity.
    * Once the update goes through, the customer will be shown the total cost of their purchase.

## Techology Stack:
  * Node.js
  * JavaScript
  * MySql
  * MySql Workbench
  * npm Inquirer

## Methodology:


## Problems That I Overcame:



## Problems Still Facing:


## Code Snippets:

## This App's Link to My Portfolio Page:

