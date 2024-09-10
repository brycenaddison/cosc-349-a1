This repository uses Docker Compose to help manage the development and building process.

# Development

The development environment creates Docker instances of the database, backend, and frontend. The database is shared between the development and production environments. In the development environment, you can make changes to the code and see them immediately reflected.

You can access the frontend environment at `http://localhost:3000` and the backend environment at `http://localhost:5001`.

To run the development environment (database, backend, frontend):
```bash
docker-compose up frontend-dev
```

If you only want to work on the backend, then you can choose to only run the backend container:
```bash
docker-compose up backend-dev
```

You may need to rebuild the image if dependencies are updated:
```bash
docker-compose build frontend-dev
```

# Production

The production environment builds an optimized backend and frontend and needs to be rebuilt every time changes are made.

You can access the frontend environment at `http://localhost:80` and the backend environment at `http://localhost:3001`.

To build a production environment (database, production backend, production frontend):
```bash
docker-compose build frontend
docker-compose up -d frontend
```

# pgAdmin

If you want to use pgAdmin to manage the database, you can run the pgAdmin container:
```bash
docker-compose up -d pgadmin
```

You can log in with username `admin@admin.com` and password `root`.
If this is the first time using pgAdmin, you will need to add the server. Use the hostname `postgres` and the password `root`, changing no other settings.