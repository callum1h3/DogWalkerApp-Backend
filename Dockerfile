FROM node:slim
ENV MONGO_URL=none
ENV SECRET_KEY=sbjbdfhsf2!!1kjjaj1!A
ENV WEB_PORT=3005
WORKDIR  /app
COPY package*.json app.js ./
RUN npm install
EXPOSE 3005
CMD ["node", "app.js"]
