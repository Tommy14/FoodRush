# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose the service port
EXPOSE 9200

# Start the app
CMD ["npm", "run", "dev"]
