FROM node:22-alpine
WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=5000
EXPOSE 5000
CMD [ "npm" , "start" ]
