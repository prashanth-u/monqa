FROM node:alpine

WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm install

COPY . .

CMD sh -c $' \n\
    if [ "${NODE_ENV}" = "development" ]; \n\
    then npm run dev; \n\
    else npm start; \n\
    fi'