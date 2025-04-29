# Restaurant service container configuration

# Base image with Node.js 20
FROM node:20

# Define application working directory
WORKDIR /app

# Install dependencies separately to leverage Docker layer caching
COPY package*.json ./
RUN npm install

# Copy all application files
COPY . .

# Open port 9100 for external access
EXPOSE 9100

# Launch the application in development mode
CMD ["npm", "run", "dev"]
