# Bus Booking System with Sequelize Associations

## Objective

In this phase, we introduce **One-to-Many relationships** using Sequelize associations and foreign keys.

We will create associations between:

- Users ↔ Bookings
- Buses ↔ Bookings

This allows us to track which user made a booking and which bus was booked.

---

# Understanding Foreign Keys

A **Foreign Key** is a column in one table that references the primary key of another table.

Foreign keys help:

- Link related tables together
- Maintain data integrity
- Prevent invalid references
- Enable efficient queries using joins

### Example

#### Users Table

| id | name |
|----|------|
| 1 | John Doe |

#### Bookings Table

| id | seatNumber | userId |
|----|------------|--------|
| 1 | 10 | 1 |

Here, `userId` is a foreign key that links a booking to a user.

---

# Associations Used

## User ↔ Booking

A user can make multiple bookings.

```javascript
User.hasMany(Booking);
Booking.belongsTo(User);
```

### Relationship

```text
User (1) --------> (Many) Bookings
```

---

## Bus ↔ Booking

A bus can have multiple bookings.

```javascript
Bus.hasMany(Booking);
Booking.belongsTo(Bus);
```

### Relationship

```text
Bus (1) --------> (Many) Bookings
```

---

# Project Structure

```text
bus-booking-system/
│
├── config/
│   └── database.js
│
├── models/
│   ├── User.js
│   ├── Bus.js
│   └── Booking.js
│
├── controllers/
│   ├── userController.js
│   ├── busController.js
│   └── bookingController.js
│
├── routes/
│   ├── userRoutes.js
│   ├── busRoutes.js
│   └── bookingRoutes.js
│
├── app.js
├── package.json
└── .env
```

---

# Installation

Initialize project:

```bash
npm init -y
```

Install dependencies:

```bash
npm install express sequelize mysql2 dotenv
```

---

# Database Configuration

## config/database.js

```javascript
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "bus_booking_db",
  "root",
  "password",
  {
    host: "localhost",
    dialect: "mysql"
  }
);

module.exports = sequelize;
```

---

# Models

## User Model

```javascript
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  }
});

module.exports = User;
```

---

## Bus Model

```javascript
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Bus = sequelize.define("Bus", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  busNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  totalSeats: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  availableSeats: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Bus;
```

---

## Booking Model

```javascript
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  seatNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Booking;
```

---

# Defining Associations

Add the following inside `app.js` before syncing the database:

```javascript
User.hasMany(Booking);
Booking.belongsTo(User);

Bus.hasMany(Booking);
Booking.belongsTo(Bus);
```

These associations automatically create:

- `UserId` foreign key in Bookings table
- `BusId` foreign key in Bookings table

---

# Database Synchronization

```javascript
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database Synced");
  })
  .catch(err => console.log(err));
```

---

# API Endpoints

## Create User

### Endpoint

```http
POST /users
```

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Response

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

## Create Bus

### Endpoint

```http
POST /buses
```

### Request Body

```json
{
  "busNumber": "MH12AB1234",
  "totalSeats": 40,
  "availableSeats": 30
}
```

### Response

```json
{
  "id": 1,
  "busNumber": "MH12AB1234",
  "totalSeats": 40,
  "availableSeats": 30
}
```

---

## Create Booking

### Endpoint

```http
POST /bookings
```

### Request Body

```json
{
  "userId": 1,
  "busId": 1,
  "seatNumber": 10
}
```

### Response

```json
{
  "id": 1,
  "seatNumber": 10,
  "UserId": 1,
  "BusId": 1
}
```

---

# Fetch Bookings Using Associations

## Get All Bookings of a User

### Endpoint

```http
GET /users/:id/bookings
```

### Example

```http
GET /users/1/bookings
```

### Sequelize Query

```javascript
Booking.findAll({
  where: { UserId: req.params.id },
  include: [Bus]
});
```

### Response

```json
[
  {
    "id": 1,
    "seatNumber": 10,
    "Bus": {
      "busNumber": "MH12AB1234"
    }
  }
]
```

---

## Get All Bookings of a Bus

### Endpoint

```http
GET /buses/:id/bookings
```

### Example

```http
GET /buses/1/bookings
```

### Sequelize Query

```javascript
Booking.findAll({
  where: { BusId: req.params.id },
  include: [User]
});
```

### Response

```json
[
  {
    "id": 1,
    "seatNumber": 10,
    "User": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

---

# Database Tables

## Users

| Column | Type |
|----------|----------|
| id | INTEGER |
| name | VARCHAR |
| email | VARCHAR |

---

## Buses

| Column | Type |
|----------|----------|
| id | INTEGER |
| busNumber | VARCHAR |
| totalSeats | INTEGER |
| availableSeats | INTEGER |

---

## Bookings

| Column | Type |
|----------|----------|
| id | INTEGER |
| seatNumber | INTEGER |
| UserId | INTEGER (FK) |
| BusId | INTEGER (FK) |

---

# Testing in Postman

### Step 1

Create a User

```http
POST /users
```

---

### Step 2

Create a Bus

```http
POST /buses
```

---

### Step 3

Create a Booking

```http
POST /bookings
```

with:

```json
{
  "userId": 1,
  "busId": 1,
  "seatNumber": 10
}
```

---

### Step 4

Fetch User Bookings

```http
GET /users/1/bookings
```

---

### Step 5

Fetch Bus Bookings

```http
GET /buses/1/bookings
```

---

# Deliverables Completed

✅ Explained foreign keys and their purpose

✅ Created User, Bus, and Booking models

✅ Linked Users and Bookings using One-to-Many association

✅ Linked Buses and Bookings using One-to-Many association

✅ Added foreign keys (`UserId`, `BusId`) in Bookings table

✅ Created APIs for Users, Buses, and Bookings

✅ Implemented association queries using Sequelize `include`

✅ Verified relationships using Postman and MySQL Workbench

---

# Commit Message

```bash
git commit -m "Implemented User-Booking and Bus-Booking associations using Sequelize"
```

# Submission Description

Implemented One-to-Many associations using Sequelize between Users and Bookings, and between Buses and Bookings. Added foreign keys in the Bookings table, created APIs to create users, buses, and bookings, and fetched related data using Sequelize associations with `include`. Verified all relationships through Postman requests and MySQL Workbench.
