## General info

Project focusing on the server side of an online store. This project aims to provide a backend solution for managing various aspects of an online store. It includes features such as JWT token-based authorization, email-based account activation, support for multiple user roles (USER and ADMIN), image uploading functionality, user and product management, shopping cart functionality, device rating capabilities, and seamless integration with a local PostgreSQL database. The project utilizes a variety of technologies listed in the Technologies section to achieve these functionalities.

## Diagram
![alt text](https://github.com/FrankJaskon/online-store-server/blob/main/online_store_diagram.drawio.jpg "Diagram")

## Technologies
Project is created with:

-   bcrypt: 5.1.0
-   cookie-parser: 1.4.6
-   cors: 2.8.5
-   dotenv: 16.0.3
-   express: 4.18.2
-   express-fileupload: 1.4.0
-   express-validator: 6.14.3
-   jsonwebtoken: 8.5.1
-   nodemailer: 6.9.0
-   pg: 8.8.0
-   pg-hstore: 2.3.4
-   sequelize: 6.27.0
-   uuid: 9.0.0

## Features

- Authorization by jwt tokens (access and refresh)
- Account activation by an email
- Support several roles 'USER' | 'ADMIN'
- An opportunity to upload images on the server
- An opportunity to add new users, types, brands, devices
- An opportunity to change devices
- An opportunity to fill shopping card
- An opportunity to leave grade to devices
- Connection with local data base PostgreSQL 
- Error handler
- Auth middleware
- Role middleware
