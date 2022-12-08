# Contact System

## Prereqs:

You will need to have docker installed on your machine

## Start the app

Create the network for containers to communicate on

```
docker network create contact-sys-network
```

Start the backend and frontend

```
docker-compose -f ./backend/docker-compose.yml up -d && docker-compose -f ./client/docker-compose.yml up -d
```

## Visit the app

go to http://localhost:3000

_The client might take some time to start. If visitng localhost:3000 result in page not found. Refresh for a few times._

<hr>

### Notes:

VCards works ideally with version 4.0.
