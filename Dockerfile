FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN mkdir -p logs
EXPOSE 3000
# Run node directly (not via npm) so SIGTERM from docker stop reaches the app
CMD ["node", "server.js"]