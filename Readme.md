# **Rest-API**
A robust and scalable contact management system that allows users to register, manage contacts, mark spam, and search for users or numbers in the global database. This project includes built-in authentication, spam detection, and caching for optimized performance.

---

## **Features**

- **User Management**:
  - User registration and login with secure password hashing.
  - Unique email and phone number validation.
- **Contact Management**:
  - Add contacts with name and phone number.
  - Mark phone numbers as spam globally.
- **Search Functionality**:
  - Search contacts and users by name or phone number.
  - Spam likelihood visibility for all search results.
- **Global Database**:
  - Supports searching for unregistered numbers or random contacts.
- **Email Privacy**:
  - Email visibility is restricted to users in mutual contact lists.
- **Authentication**:
  - Secure JWT-based authentication for all protected routes.
- **Production-Ready Architecture**:
  - Modular, scalable project structure with centralized error handling.

---

## **Technologies Used**

- **Backend**: Node.js, Express.js , Typescript
- **Database**: MySQL (via Prisma ORM)
- **Authentication**: JWT
- **Testing**: faker-js (To generate fake data)

---

## **Getting Started**

### **Prerequisites**

- [Node.js](https://nodejs.org/en/) (version 16+ recommended)
- [MySQL](https://www.mysql.com/)
- [Prisma]

---

### **Installation**

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the `.env` file:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="mysql://username:password@localhost:3306/database_name"
   JWT_SECRET="your_jwt_secret_key"
   PORT=3000
   ```

3. Initialize the database:
   Run the Prisma migrations to set up your MySQL database:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Seed the database with sample data:
   ```bash
   npm run seed
   ```

5. Run the application:
   ```bash
   npm start
   ```

---

### **API Documentation**

#### **Base URL**
```
http://localhost:3000/api
```

#### **Endpoints**

| **Method** | **Endpoint**         | **Description**                                              |
|------------|----------------------|--------------------------------------------------------------|
| `POST`     | `/auth/register`             | Register a new user.       |
| `POST`     | `/auth/login`                | Login and obtain a JWT token|
| `POST`     | `/contacts/add-contact/:id`  |Add a new contact.     |
| `POST`     | `/spam/mark`                 | Mark a phone number as spam.  |
| `GET`     | `/search/contact/:id`         | Search users or contacts by name or phone number.|
| `GET`     | `/contacts/fetch-contacts/:id`| List all contacts in a user contact list.
| `GET`     | `/spam/check`                 | Check spam contact     |
---

### **Testing**

1. End to end tests has been done manually.

---

### **Project Structure**

```
Rest-API/
├── prisma/
│   ├── schema.prisma         # Prisma schema file
│   ├── migrations/           # Database migration files
│   └── seed.ts               # Database seeding script
├── src/
│   ├── controllers/          # API controllers
│   │   ├── authController.ts
│   │   ├── contactController.ts
│   │   ├── spamController.ts
│   │   └── searchController.ts
│   ├── middlewares/          # Custom middlewares
│   │   ├── authMiddleware.ts
│   │   └── errorMiddleware.ts
│   ├── routes/               # API routes
│   │   ├── authRoutes.ts
│   │   ├── contactRoutes.ts
│   │   ├── spamRoutes.ts
│   │   └── searchRoutes.ts
│   ├── utils/                # Utility functions
│   │   ├── AppError.ts
│   │   └── Validators.ts           
│   └── index.ts              # Entry point
├── .env                      # Environment variables
├── package.json              # NPM configuration
└── README.md                 # Project documentation
```

---

### **Future Improvements**

- Implement rate-limiting using Redis for API abuse protection.
- Add support for pagination in search results.
- Deploy the application to a cloud platform (e.g., AWS, Vercel).
- Enhance test coverage with more edge-case scenarios.

---

### **Known Issues**

- **Optimization**: There is a room for optimization in the search functionality.
- **Error Handling**: Some error messages could be more user-friendly.


--- 