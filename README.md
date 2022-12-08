# Contact System

## Prereqs:

You will need to have docker installed on your machine

## Start the app

Create the network for containers to communicate on

```
docker network create -d contact-sys-network
```

Start the backend and frontend

```
docker-compose -f ./backend/docker-compose.yml up -d && docker-compose -f ./client/docker-compose.yml up -d
```

## Visit the app

go to http://localhost:3000

<hr>

### Notes:

VCards works ideally with version 4.0.
