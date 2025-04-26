# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose internal port
EXPOSE 9300

# Start the service
CMD ["npm", "run", "dev"]
