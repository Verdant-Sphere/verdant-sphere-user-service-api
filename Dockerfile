
FROM node:lts-slim as build

LABEL Maintainer="Khant Naing Set"

RUN npm install -g pnpm

WORKDIR /usr/local/src

COPY package.json pnpm-lock.yaml /usr/local/src/

RUN pnpm install --prod 

COPY . /usr/local/src/

RUN pnpm build



FROM node:lts-alpine

ENV NODE_ENV production

USER node

WORKDIR /usr/local/src

COPY --chown=node:node --from=build /usr/local/src/node_modules/ /usr/local/src/node_modules/
COPY --chown=node:node --from=build /usr/local/src/dist/ /usr/local/src/dist/


EXPOSE 3000

ENTRYPOINT [ "node" ]

CMD [ "./dist/main.js" ]
