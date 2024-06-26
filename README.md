# Scrum Tools

The project provides tools to support in scrum processes.

[**Scrum Tools Demo**](https://scrumit.live/)

Features:

* Estimation of topics. See [UI concept](scrum-tools-ui/README.md)


Stack:

* Database: Redis
* Backend: Nest.js
* API: GraphQL
* Frontend: Angular

## Start development

Clone:
    
    git clone https://github.com/dhcode/scrum-tools.git
    cd scrum-tools

Install dependencies:

    npm install
    cd scrum-tools-ui
    npm install

Start redis: 

    docker run -p 6379:6379 --name redis redis:5.0.8-alpine

Start backend:
    
    npm run start:dev 

Start frontend

    cd scrum-tools-ui
    npm run start
    
Open the UI: http://localhost:4200

Open the API Explorer: http://localhost:3000/graphql

## Deployment

Docker image built and provided by [Docker Hub](https://hub.docker.com/repository/docker/dhcode/scrum-tools)

Build manually:

    docker build -t dhcode/scrum-tools:latest .
    docker push docker.io/dhcode/scrum-tools:latest

See [deployment/README.md](deployment/README.md)

## Issues

* XSS vulnerability: Secrets are stored in the local store of the browser. TODO: Implement cookie based session management.


## License

  [MIT licensed](LICENSE)
