FROM node:slim
WORKDIR  /app
COPY package*.json app.js ./
RUN npm install
EXPOSE 3005
CMD ["node", "app.js"]
