# Node + DynamoDB (local) CRUD

Simple MVC Node.js app demonstrating CRUD against DynamoDB Local (docker).

Quick start with Docker Compose:

```bash
cp .env.example .env    # edit if you want
docker-compose up --build
```

Open http://localhost:3000

Notes:

- The `docker-compose.yml` runs `amazon/dynamodb-local` on port 8000 and the web app on 3000.
- Table `Products` is created automatically on startup if missing.

To run locally without Docker (if you have local DynamoDB):

```bash
npm install
npm run dev
```
