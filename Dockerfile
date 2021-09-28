# using multi-stage build as lux developer might need to target a lux-start build
FROM node:16-alpine3.14 as build

RUN npm i -g npm@7.21.0

# running as root user prior to this
USER node

RUN mkdir -p /home/node/test-app
WORKDIR /home/node/test-app

# if package-lock.json and package.json have not changed, container will not have to be rebuilt
COPY --chown=node:node ./test-app/package-lock.json ./test-app/package.json ./

RUN npm i -D
RUN npm i web-vitals --save-dev

COPY --chown=node:node ./test-app ./

FROM build as test-app
USER node
CMD ["npm", "start"]