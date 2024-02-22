# GOG_WBD_MID
# E-commerce Gadgets of Galaxy Demo

This is an application that demonstrates an E-commerce website using the nodejs. The application loads 
products from MongoDB database and displays them. The loading page directly takes to home page.
We have three types of users.  
Users can register and login through gmail, buy products and can add reviews. Click on any product to get more information including pricing. Users can select items and 
add them to their shopping cart and wishlist.
Sellers can add products, check the reviews and manage his dashboard.
Admin can approve or revoke sellers and can give reply to mesaages of users.

## Import Data
We have included a DB dump file in this repo. Import them to your mongodatabase and connect the string to your code.

## Getting Started
To get started  you can simply clone this `GOG` repository and install the dependencies.

Clone the `GOG` repository using git:

```bash
git clone https://github.com/Gadgets-Of-Galaxy/GOG_WBD

cd GOG
```

Install dependencies with this command:
```bash
npm install
```

Change the connection string(mongo db) with your personal one and add the products data into it according to schema given in models.

Run the application(for client) with this command:
```bash
npm run dev
```
Run the application(for server) with this command:
```bash
npx nodemon server
```
Used:
nodejs
mongodb



Github link: https://github.com/Gadgets-Of-Galaxy/GOG_WBD



