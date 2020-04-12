# Scrum Tools

The project provides tools to support in scrum processes.

**Work in progress**

Features:

* Estimation of topics. See [UI concept](scrum-tools-ui/README.md)


Stack:

* Database: Redis
* Backend: Nest.js
* API: GraphQL
* Frontend: Angular

## Start development

Start redis: 

    docker run -p 6379:6379 --name redis redis:5.0.8-alpine

Start backend:
    
    npm run start:dev 

Start frontend

    cd scrum-tools-ui
    npm run start
    
Open: http://localhost:4200

## License

  [MIT licensed](LICENSE)
