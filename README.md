# Music Library API

A fully functional RESTful API for managing a music library, featuring user
authentication and CRUD operations. The API is developed using Node.js with
PostgreSQL and Redis as its database and caching layer, respectively.

## Hosted API

**Base URL:**

```
https://music-library-api.samarthdhawan.com/api/v1
```

## Getting Started for Development

Follow the steps below to set up the API for development:

### Prerequisites

1. Install [Node.js](https://nodejs.org/).
2. Install [pnpm](https://pnpm.io/):
   ```bash
   npm install -g pnpm
   ```
3. Ensure [Docker](https://www.docker.com/) is installed and running.

### Clone the Repository

```bash
git clone https://github.com/samarth8765/music-library-api
cd music-library-api
```

### Install Dependencies

```bash
pnpm install
```

### Set Up Databases

You can either:

1. Create a `.env` file from the provided `.env.example` file and enter your own
   PostgreSQL and Redis URLs:

   Example `.env` file:
   ```env
   DATABASE_URL=postgres://yourusername:yourpassword@localhost:5432/yourdatabase
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your-secret-key
   ```

2. Or set up the databases using Docker with the following commands:

#### Start Redis

Run the following command to start a Redis instance:

```bash
docker run --name redis -p 6379:6379 -d redis
```

Redis is used for blacklisting tokens to manage user sessions securely.

#### Start PostgreSQL

Run the following command to start a PostgreSQL instance:

```bash
docker run --name postgres -p 5432:5432 -d -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=mydatabase postgres
```

PostgreSQL URL:

```
postgres://postgres:mysecretpassword@localhost:5432/mydatabase?schema=public
```

### Run the Development Server

Start the API server in development mode:

```bash
pnpm run dev
```

The API will be available at `http://localhost:3000/api/v1`.

## Running for Production

To run the API in production, use Docker Compose:

```bash
docker compose up
```

This will set up the entire environment, including PostgreSQL, Redis, and the
API server.

### Example Endpoints

1. **Health Check:**
   ```
   GET https://music-library-api.samarthdhawan.com/api/v1/ping
   ```

2. **Signup:**
   ```
   POST https://music-library-api.samarthdhawan.com/api/v1/signup
   ```

3. **Login:**
   ```
   POST https://music-library-api.samarthdhawan.com/api/v1/login
   ```

4. **Users:**
   ```
   GET https://music-library-api.samarthdhawan.com/api/v1/users
   ```

## Testing the API

For API testing, you can import the provided Postman collection file:

```
music-api.postman_collection
```
