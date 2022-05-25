FROM node:16-alpine as build
WORKDIR /app
COPY package.json nginx.conf ./

# for node-gyp    
RUN apk add --no-cache python3 make g++

RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html