# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Expose port
EXPOSE 9400

# Start the service
CMD ["npm", "start"]
