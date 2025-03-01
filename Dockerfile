# Use Ubuntu 22.04 as the base image
FROM ubuntu:22.04

# Set working directory
WORKDIR /app

# Install Node.js and npm
RUN apt update && apt install -y nodejs npm

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 3000
EXPOSE 4000

# Command to run the app
CMD ["npm", "run", "start"]
