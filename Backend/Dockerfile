# Use Node.js LTS (Long Term Support) version
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy app source code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application in production
CMD ["npm", "start"] 