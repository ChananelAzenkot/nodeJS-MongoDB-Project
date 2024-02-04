# REST API for Business Content Management with Node.js

## Project Summary

This project is a REST API server built with Node.js, designed to support a web application for managing business content. The API provides functionality for business users to create, update, and delete content.

## Core Features

- User registration, login, and profile management.
- Creation and management of business cards.
- Content publishing with access control for business users.

## Tech Stack

- **MongoDB**: Used for data storage.
- **Express.js**: Web server framework.
- **Mongoose**: MongoDB object modeling tool.
- **Bcryptjs**: For secure password hashing.
- **Joi**: For data validation.
- **JsonWebToken**: For secure user authentication.
- **Config**: For managing configurations.
- **Morgan**: For logging HTTP requests.
- **Cors**: For handling Cross-Origin Resource Sharing.
- **Chalk**: For styling console output.

## Additional Features and Bonus

- **Biz Number Editing**: Users can edit their Biz Number.
- **File Logger**: All 400+ errors are logged to a 'logs' folder.
- **User Blocking**: Users are blocked for 24 hours after 3 failed login attempts.

## API Routes

### User Routes

### User Routes

| No. | Method | URL          | Description       | Authorization            | Returns       |
| --- | ------ | ------------ | ----------------- | ------------------------ | ------------- |
| 1   | POST   | /api/users       | Register a user   | All                      | User object   |
| 2   | POST   | /users/login | User login        | All                      | JWT           |
| 3   | GET    | /api/users       | Get all users     | Admin                    | Array of users|
| 4   | GET    | /api/user/:id   | Get a user        | Registered user or Admin | User object   |
| 5   | PUT    | /api/user/:id   | Update a user     | Registered user          | Updated user  |
| 6   | PATCH  | /api/user/:id   | Change isBusiness | Registered user          | Updated status|
| 7   | DELETE | /api/user/:id   | Delete a user     | Registered user or Admin | Deleted user  |

### Card Routes

| No. | Method | URL                   | Description     | Authorization         | Returns       |
| --- | ------ | --------------------- | --------------- | --------------------- | ------------- |
| 1   | GET    | /api/cards                | Get all cards   | All                   | Array of cards|
| 2   | GET    | /api/my-cards       | Get user's cards| Registered user       | User's cards  |
| 3   | GET    | /api/card/:id            | Get a card      | All                   | Card object   |
| 4   | POST   | /api/addCard                | Create a card   | Business user         | Created card  |
| 5   | PUT    | /api/card/:id            | Update a card   | Card creator          | Updated card  |
| 6   | PATCH  | /api/cardLike/:id            | Like a card     | Registered user       | Updated card  |
| 7   | DELETE | /api/card/:id            | Delete a card   | Card creator or Admin | Deleted card  |
| 8   | PATCH  | /api/bizNumber/:id | Update Biz Number| Admin                | Updated user  |
## Setup

To get started, clone the repository and install the dependencies:

# My Node.js and MongoDB Project

Welcome to my Node.js and MongoDB project! If you want to clone this repository, use the following command:

[Clone this repository](https://github.com/ChananelAzenkot/nodeJS-MongoDB-Project.git)

## Getting Started
npm install
nodemon