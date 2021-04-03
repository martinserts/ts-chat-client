FROM node:15.13.0-alpine3.10 as build

WORKDIR /app
COPY . .

RUN yarn && \
  CI=true yarn test && \
  GENERATE_SOURCEMAP=false yarn build

FROM halverneus/static-file-server:latest
WORKDIR /app

COPY --from=build /app/build/ ./

ENV FOLDER /app
