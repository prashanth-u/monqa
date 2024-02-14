FROM node:alpine

WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm install

COPY . .

ARG NODE_ENV

# FIXME
# RUN sh -c $' \
#     if [ "${NODE_ENV}" = "production" ]; \
#     then npm run build; \
#     fi'
# CMD sh -c $' \
#     if [ "${NODE_ENV}" = "development" ]; \
#     then npm start; \
#     elif [ "${NODE_ENV}" = "staging" ]; \
#     then npm test; \
#     else echo "Running in production"; \
#     fi'

CMD sh -c $' \
    if [ "${NODE_ENV}" = "staging" ]; \
    then npm test; \
    else npm start; \
    fi'