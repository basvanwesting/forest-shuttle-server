FROM arm32v7/node:11

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

ENV CFLAGS="-march=armv7-a"
ENV CXXFLAGS="-march=armv7-a"
RUN npm install --unsafe-perm

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "npm", "start" ]
