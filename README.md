# 101544778_COMP3123_Assignment1

### Application Purpose: 
- This project is a RESTFUL backend API build with Node.js, Express and MongoDB for managing users and employees. 
- It provides user registration, JWT-based authentication and full CRUD operations for employee records


# Technologies Used: 
- Node.js, Express 
- JSON Web Tokens, bycrptjs 
- Containerization: Docker and Docker Compose 


# Installation and Setuo 
- git clone https://github.com/OJean2468/101544778_COMP3123_Assignment1.git 

# Install Dependencies 
- npm install 

* Configure Environment Variables 
- create a .en v file in the root direction (use the .env.example)

# Start MongoDB 
- docker compose up --build

# Starting the Application 
- npm start 
- npm run dev

# Where the project will start: 
- http://localhost:3000 

# Testing the API 
- Use postman to test the user and employee EndPoints 

# User Endpoints 
- /api/v1/user/signup (POST) Registers users and accepts username, email and password in request body
- /api/v1/user/login (POST) logs the user in, supports authentication of username + password or email + password and provides a 200 OK response containing a JSON web Token 

# Employee Endpoints 
- /api/v1/emp/employees (GET) gets all authenticated users 
- /api/v1/emp/employees (POST) creates new employees 
- /api/v1/emp/employees/{eid} (GET) fetches an employee based on the specified ID 
- /api/v1/emp/employees/{eid} (PUT) Updates an existing employee with the ID specified 
- /api/v1/emp/employees?eid=xxx (DELETE) Deletes an existing employee with the query parameter ?eid=ID 