#FROM nginx:latest
#COPY /dist/create-a-dynamic-reactive-angular-orm-with-json /user/share/nginx/html
FROM node:14.17.0-alpine as build-step
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build --prod

FROM nginx:1.20.1
COPY --from=build-step /app/dist/create-a-dynamic-reactive-angular-orm-with-json /usr/share/nginx/html
EXPOSE 4200:80
