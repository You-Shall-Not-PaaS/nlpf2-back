# Pull in the official lightweight version of Node 16.
FROM node:16-slim

# Create and change to the app directory.
WORKDIR /app

ENV PORT=5555

COPY package*.json .

# Install dependencies.
RUN npm install

# Copy local codebase into the container image
COPY . ./

EXPOSE 5555

# Run the web service on container startup.
CMD [ "npm", "start" ]
