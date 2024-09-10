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

After navigating to `http://localhost:5050`, you can log in with username `admin@admin.com` and password `root`.
If this is the first time using pgAdmin, you will need to add the server. Use the hostname `postgres` and the password `root`, changing no other settings.

# VM Explanation

The Docker Compose file can build 6 different VMs:
- `postgres`: This container hosts the database and is required to use either of the backend vms. It is configured and preloaded on first build, then saves the database values to a volume for persistent storage.
- `pgadmin`: This container runs an instance of pgAdmin which is a Postgres database management software that can be accessed in the browser. This can be used to log into and manage the database in the `postgres` container.
- `backend`: This container builds a production build of the Express.js backend server, which hosts API calls that can be used to fetch and post data to the `postgres` container database.
- `frontend`: This container builds and runs the Next.js frontend server, which delivers the server-side rendered website. When a webpage is accessed, a request is made to the server to fetch data from the `backend` database which can then be used to hydrate the web page and send it to the end user.
- `backend-dev`: This container runs a development version of the Express.js server, with a configuration that allows changes to the backend project to be reflected immediately in the containerized instance.
- `frontend-dev`: This container runs the development Next.js server, with a similar configuration that allows live editing at the cost of performance.