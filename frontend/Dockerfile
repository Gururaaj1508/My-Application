FROM node:12-alpine
LABEL Description="my-frontend"
WORKDIR /app
COPY ./middleware .
COPY ./dist/app ./frontend
EXPOSE 9000
CMD ["npm", "start"]