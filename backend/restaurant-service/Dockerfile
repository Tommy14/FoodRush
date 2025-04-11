# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first to install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the service port
EXPOSE 9100

# Start the app using nodemon (for dev) or node (for prod)
CMD ["npm", "run", "dev"]
