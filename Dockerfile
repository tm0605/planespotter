FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install any dependencies
RUN npm install

# Bundle app source inside the Docker image
COPY . .

RUN npm run build

EXPOSE 5000

CMD [ "node", "server/server.js" ]