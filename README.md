# Note Taking App

A simple note-taking application built with Node.js, Express, and MongoDB.

## Framework

This project uses **Express.js** as the web application framework. Express is a fast, unopinionated, minimalist web framework for Node.js, and it provides a robust set of features for web and mobile applications.

## Database

The application utilizes **MongoDB** as the database. MongoDB is a NoSQL database that provides flexibility and scalability, making it suitable for projects with dynamic schemas.

## Third-Party Tools

- **jsonwebtoken**: Used for generating and verifying JSON Web Tokens (JWT) for user authentication.
- **mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js, simplifying interactions with the MongoDB database.

## Running the Code

Follow the steps below to run the project locally:

1. Clone the repository:

    ```bash
    git clone https://github.com/rubindersinghsandhu/Speer-backend-assesment-project.git
    cd Speer-backend-assesment-project
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and add the following:

    ```env
    PORT=3000
    MONGO_URI=mongodb_connection_string
    JWT_SECRET_KEY=jwt_secret_key
    ```

    Replace `mongodb_connection_string` and `jwt_secret_key` with your MongoDB connection string and a secret key for JWT.

4. Run the application:

    ```bash
    npm start
    ```

The application should now be running at `http://localhost:3000`.

## Running Tests

To run the tests, use the following command:

```bash
npm test
```

This will execute both unit tests and integration tests.

## Setup Files

- **/models**: Directory defining MongoDB data models (e.g., User, Note).

- **/routes**: Directory handling Express.js route definitions.

- **/controllers**: Directory containing application logic for route handlers.

- **/middlewares**: Includes authentication and rate-limiting middleware.

- **/tests**: Directory containing unit tests and integration tests. Ensure that the tests cover various aspects of your application.

- **.env**: Environment file containing sensitive information like database connection strings and JWT secret. Create this file in the root directory and add your configuration:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/your-database-name
JWT_SECRET_KEY=your-secret-key
```

- **.gitignore**: File specifying patterns to exclude from version control. Ensure to include the following entries:

```
node_modules/
.env
```


- **package.json**: Configuration file for Node.js projects. Includes project metadata, dependencies, scripts, etc.

- **package-lock.json**: Auto-generated file for npm to lock down the versions of installed packages.

## Additional Notes

- **Testing**: The project uses the Jest testing framework and Supertest library for testing API routes. Ensure you have these dependencies installed (`npm install --save-dev jest supertest`).

- **Environment Variables**: Update the values in the `.env` file with your actual configuration.

- **Database Setup**: Ensure MongoDB is installed and running locally. Adjust the `MONGO_URI` in the `.env` file accordingly.

- **Running Locally**: Execute `npm start` to run the application locally.

- **Running Tests**: Execute `npm test` to run unit tests and integration tests.



