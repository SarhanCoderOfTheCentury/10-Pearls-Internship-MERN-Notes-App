# Use official Node.js lightweight image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port (Cloud Run defaults to PORT 8080)
ENV PORT=8080
EXPOSE 8080

# Start Express server
CMD ["npm", "start"]
