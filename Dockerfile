FROM dogwalker_backend:14
WORKINGDIR /usr/src/app
COPY package*.json app.js ./
RUN npm install
EXPOSE 3005
CMD ["node", "app.js"]