FROM node:18-alpine

WORKDIR /app

COPY  ./package.json .

RUN npm install

COPY . .

ENV PORT=8001
ENV DATABASE_PORT=5432
ENV DATABASE_HOST=astra.rtt.digital
ENV DATABASE_USER=skid
ENV DATABASE_PASSWORD=567TYU%^&tyu
ENV DATABASE_NAME=skud_va
ENV DATABASE_SCHEMA=mto_test

EXPOSE $PORT

CMD ["npm", "run", "dev"]

