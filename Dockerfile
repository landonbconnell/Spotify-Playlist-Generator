# syntax=docker/dockerfile:1

# Use an official Node runtime as a base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install bash
RUN apk add --no-cache bash

# Set the environment to production
ENV NODE_ENV=production

# Copy package.json and package-lock.json
COPY ["package.json", "package-lock.json*", "./"]

# Install Node.js dependencies
RUN npm install --production

# Copy everything else
COPY . .

# Expose ports
EXPOSE 3000
EXPOSE 5000

COPY start.sh .

# Make the start script executable
RUN chmod +x start.sh

# Run the start script
CMD ["/bin/bash", "-c", "./start.sh"]
