# Runs Tests
FROM node:12-alpine as tester
COPY . .
RUN npm ci
RUN npm test

#build base 
FROM node:12-alpine as builder
COPY package*.json ./
RUN npm ci --only=production

#config and run
FROM node:12-alpine
ARG PORT_ARG
ENV PORT=$PORT_ARG
EXPOSE $PORT_ARG
WORKDIR /home/node/app
USER node
COPY --from=builder node_modules node_modules
COPY --chown=node:node . .
ARG COMMIT_SHA
RUN printf $COMMIT_SHA > metadata
ENTRYPOINT [ "npm", "start" ]
