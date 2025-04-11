# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the port the app runs on
EXPOSE 9000

# Start the app
CMD ["npm", "run", "dev"]
