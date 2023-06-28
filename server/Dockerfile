# syntax=docker/dockerfile:1

# Use an official Node runtime as a base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production

# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json* ./

# Install Node.js dependencies
RUN npm install --production

# Copy everything else
COPY . .

# Expose ports
EXPOSE 5000

# Run the start script
CMD npm start
