# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock, pnpm-lock.yaml)
COPY package.json yarn.lock* pnpm-lock.yaml* ./
# Install dependencies
RUN npm install --frozen-lockfile --production=false

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Create the production-ready image
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment variables for Next.js standalone output
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Copy only the necessary files for standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js application
CMD ["node", "server.js"]