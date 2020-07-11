# CodePlayer
An online judge system for competitive programming platform, The website is hosted on http://codeplayer.ninja

## Installation
The installation has been well tested to work on Ubuntu 16.04. Issues have been reported with installation on windows.
* Install latest version of docker in your system.
* Please pull two images `stepik/epicbox-gcc:6.3.0` and `python:3.6.5-alpine` using `docker pull <image_name>`
* Clone this project; actually you only require the `docker-stack.yml` file : )
* Run the command in terminal `docker swarm init` to initialize a docker swarm.
* Execute `docker stack deploy -c docker-stack.yml cp` and as easy as that.
* All the four services will be up and running in a few minutes (depending upon your internet connectivity).
* You can check for running service by command `docker service ls`
* Any of these four running services can easily be scaled by writing `docker service scale cp_<serive_name>=<number_of_replicas_required>`

## Features
* Micro-service based architecture makes it super simple to scale. Docker images can be found at https://hub.docker.com/saurass
* Untrusted code is run in one time use isolated docker container based sandboxes, which enhances security of the website.
* Socket IO for real time status update of our submitted code.
* Use of docker swarm for orchestration. Thus making clustering of resources and scaling of services super simple.

## Services
* The app has mainly four services running independently which can be scaled individually as per requirement.
  * Frontend - The frontend is made using ReactJS and uses Redis Client to connect with socket IO server.
  * Backend - Backed or API server is based on NodeJS. We are using MongoDB for database.
  * Compiler- Microservice - This microservice is responsible for compilation, execution and evaluation of our code. This is written in Python3 and uses docker socket API to interact with docker container and execute the code in isolated docker containers.
  * Redis server - This server is responsible to maintain submission queue and is used as adapter for socket IO server.

## WorkFlow
* The code is submitted and server pushes the corresponding submission data in Redis Queue.
* The compiler microservice which is also connected on socket IO server, starts evaluation of code and gives real time update on status of evaluation.
* The status is notified to client as well as the server in real time.

## Contribution
The repository is open to contributions, feel free to raise issues and make contributions. If you like what we do, Please do buy us a coffee, the setup can be found at home page of http://codeplayer.ninja
