FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the development server (or use serve for production)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]