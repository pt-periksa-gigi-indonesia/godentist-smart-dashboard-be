FROM node:alpine

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 465
EXPOSE 80

CMD ["yarn", "start"]
