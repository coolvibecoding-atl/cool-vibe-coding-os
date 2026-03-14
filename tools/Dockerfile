FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install --production

# Copy all tools
COPY *.js ./
COPY lib/ ./lib/

# Create state directory
RUN mkdir -p .state

# Environment variables (override with .env)
ENV NODE_ENV=production

# Default command runs all tools in sequence
CMD ["sh", "-c", "node ai-trend-tracker.js && sleep 5 && node job-opportunity-radar.js && sleep 5 && node github-tools-monitor.js"]
