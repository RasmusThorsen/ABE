# SWTABE - Assignment 1

This project is created by:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Alexander Mølsted Hulgaard Rasmussen - 201607814

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Jakob Dybdahl Andersen - 201607813

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rasmus Østergaard Thorsen - 201608891

The project has been build on a NodeJs express server with a MongoDB database. The project is created in Typescript and uses Docker-Compose for hosting the system on a local machine. Some endpoints uses Bearer Authorization while others don't e.g. it was decided that you should be allowed to search for hotels and available rooms before signing up.

## Admin user
The project in development mode seeds the mongodb with an admin user that can be used to elevate the level of the other users.

Username: **admin@hotels.com**

Password: **test**
## Running the project with docker-compose
To run the project docker-compose has been used. To start docker-compose use the following command:

`docker-compose up --build`

Use `--build` to make sure that you are running the newest version of the code, instead of a cache docker version

**OBS:** The mongodb is exposed on port 27018 to the user to make sure it doesn't interfere with already running instance of mongodb. Internally on the docker network it still uses 27017

## Accessing swagger
Swagger is available on http://localhost:5000/swagger