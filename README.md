# 🚗 Vehicle Rental System (Backend)

A robust and scalable backend API for a vehicle rental service built with Node.js, Express, and TypeScript. This system facilitates seamless user management, vehicle inventory control, and a secure booking process with automated availability tracking.

**Live Demo:**

- https://vehicle-rental-system-backend-mk0v.onrender.com/

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)

---

## ✨ Features

### 🔐 Authentication & Security

- **JWT-Based Authentication**: Secure stateless authentication using JSON Web Tokens
- **Role-Based Access Control (RBAC)**: Distinct permissions for Admins and Customers
- **Password Encryption**: Secure password hashing with bcryptjs

### 🚙 Vehicle Management

- **CRUD Operations**: Complete vehicle inventory management (Create, Read, Update, Delete)
- **Automated Availability Tracking**: Vehicles automatically marked as booked/available

### 📅 Booking Engine

- **Dynamic Pricing**: Automatic cost calculation based on rental duration and daily rates
- **Auto-Return Logic**: Lazy update strategy to mark past bookings as returned and free up vehicles

### 👤 User Profile Management

- **Self-Service Profile Updates**: Users can manage their own profile information
- **Admin Dashboard**: Complete user oversight and role management
- **Safe Deletion**: Prevents deletion of users with active bookings

---

## 🛠 Technology Stack

| Category            | Technology         |
| ------------------- | ------------------ |
| **Language**        | TypeScript         |
| **Runtime**         | Node.js            |
| **Framework**       | Express.js         |
| **Database**        | PostgreSQL         |
| **Database Driver** | pg (node-postgres) |
| **Authentication**  | JWT + Bcrypt       |
| **Environment**     | Dotenv             |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (Local installation or cloud instance via Neon)
- **npm** or **yarn**

### Installation

1.  **Clone the repository**

```bash
git clone https://github.com/killuaZoldyck69/Mission-3
cd Mission-3
```

2.  **Install dependencies**

```bash
npm install
```

3.  **Configure environment variables**

Create a `.env` file in the root directory:

```env
PORT=5000
CONNECTION_STR = postgres://user:password@localhost:5432/car_rental_db
BCRYPT_SALT_ROUNDS = 10
JWT_SECRET=your_super_strong_secret_key

```

4.  **Initialize the database**

The application includes an initialization script that automatically creates necessary tables (users, vehicles, bookings) on startup.

_Optional: For manual setup, run the SQL commands found in `src/config/db.ts` using pgAdmin or DBeaver._

5.  **Start the server**

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm run build
npm start
```

The server will be running at `http://localhost:5000`

---

## 📡 API Documentation

### Authentication

| Method | Endpoint              | Description                    | Access |
| ------ | --------------------- | ------------------------------ | ------ |
| `POST` | `/api/v1/auth/signup` | Register a new user            | Public |
| `POST` | `/api/v1/auth/signin` | Login and receive access token | Public |

### Vehicles

| Method   | Endpoint                      | Description                   | Access |
| -------- | ----------------------------- | ----------------------------- | ------ |
| `POST`   | `/api/v1/vehicles`            | Add a new vehicle             | Admin  |
| `GET`    | `/api/v1/vehicles`            | Get all vehicles              | Public |
| `GET`    | `/api/v1/vehicles/:vehicleId` | View specific vehicle details | Public |
| `PUT`    | `/api/v1/vehicles/:id`        | Update vehicle details        | Admin  |
| `DELETE` | `/api/v1/vehicles/:id`        | Delete a vehicle              | Admin  |

### Bookings

| Method | Endpoint               | Description                                 | Access        |
| ------ | ---------------------- | ------------------------------------------- | ------------- |
| `POST` | `/api/v1/bookings`     | Create a new booking                        | Customer      |
| `GET`  | `/api/v1/bookings`     | Get bookings (Admin: all, Customer: own)    | Authenticated |
| `PUT`  | `/api/v1/bookings/:id` | Cancel (Customer) or Return (Admin) booking | Authenticated |

### User Management

| Method   | Endpoint            | Description                         | Access        |
| -------- | ------------------- | ----------------------------------- | ------------- |
| `GET`    | `/api/v1/users`     | Get all users                       | Admin         |
| `PUT`    | `/api/v1/users/me`  | Update own profile                  | Authenticated |
| `DELETE` | `/api/v1/users/:id` | Delete user (if no active bookings) | Admin         |

---

## 📂 Project Structure

```
├── src/
│ ├── config/ # Database connection & environment setup
│ ├── middlewares/ # Authentication (JWT) & role authorization
│ │ ├── admin.middleware.ts
│ │ └── auth.middleware.ts
│ ├── modules/ # Feature-based modules
│ │ ├── auth/ # Authentication logic (signup, signin)
│ │ ├── booking/ # Booking engine & management
│ │ ├── user/ # User profile management
│ │ └── vehicle/ # Vehicle inventory management
│ ├── types/ # TypeScript type definitions
│ └── server.ts # Application entry point
├── .env # Environment variables (not tracked)
├── .gitignore # Git ignore rules
├── package.json # Project dependencies
├── package-lock.json # Locked dependency versions
├── README.md # Project documentation
└── tsconfig.json # TypeScript configuration
```

---

<div  align="center">

<strong>Built with ❤️ using TypeScript, Node.js, and PostgreSQL</strong>

</div>
