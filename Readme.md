# Requirements
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

Note: Docker Compose is only required for Linux systems, Docker for Windows and Mac already includes Docker Compose

# Instructions
Run depending on environment:
- Development:  `docker-compose up`
- Staging:      `docker-compose -f staging.yml up`
- Production:   `docker-compose -f production.yml up`

## Notes
- If there is an error about `node_modules` you might need to create an empty `node_modules` folder under both the `client` and `server` directories