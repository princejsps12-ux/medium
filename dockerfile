
# # ---- Stage 1: Build Prisma Client ----
#     FROM node:18-slim AS prisma

#     WORKDIR /app
    
#     # Copy package files
#     COPY package.json package-lock.json ./
    
#     # Install dependencies (without dev dependencies)
#     RUN npm install --omit=dev
    
#     # Copy the Prisma schema
#     COPY prisma ./prisma
    
#     # Generate Prisma Client
#     RUN npx prisma generate
    
#     # ---- Stage 2: Build Next.js App ----
#     FROM node:18-slim AS builder
    
#     WORKDIR /app
    
#     # Copy and install dependencies
#     COPY package.json package-lock.json ./
#     RUN npm install
    
#     # Copy the entire project
#     COPY . .
    
#     # Ensure Prisma Client exists before building Next.js
#     RUN npx prisma generate
    
#     # Build Next.js app
#     RUN npm run build
    
#     # ---- Stage 3: Final Image ----
#     FROM node:18-slim AS final
    
#     WORKDIR /app
    
#     # Install OpenSSL (needed for Prisma)
#     RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*
    
#     # Copy built files from previous stages
#     COPY --from=builder /app/.next ./.next
#     COPY --from=builder /app/public ./public
#     COPY --from=builder /app/package.json /app/package-lock.json /app/
#     COPY --from=builder /app/node_modules ./node_modules
    
#     # Copy Prisma schema & generated client
#     COPY --from=prisma /app/prisma ./prisma
#     COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
    
#     # Ensure Prisma CLI is installed in the final stage
#     RUN npm install -g prisma
    
#     # Expose port 3000
#     EXPOSE 3000
    
#     # Run Prisma migrations first, then start the app
#     CMD npx prisma migrate deploy && npm run start
    
# ---- Stage 1: Build Prisma Client ----
    FROM node:18-slim AS prisma
    WORKDIR /app
    COPY package.json package-lock.json ./
    RUN npm install --omit=dev
    COPY prisma ./prisma
    RUN npx prisma generate
    
    # ---- Stage 2: Build Next.js App ----
    FROM node:18-slim AS builder
    WORKDIR /app
    COPY package.json package-lock.json ./
    RUN npm install
    COPY . . 
    RUN npx prisma generate
    RUN npm run build
    
    # ---- Stage 3: Final Image ----
    FROM node:18-slim AS final
    WORKDIR /app
    RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*
    COPY .env .env   
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/package.json /app/package-lock.json /app/
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=prisma /app/prisma ./prisma
    COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
    RUN npm install -g prisma
    EXPOSE 3000
    CMD npx prisma migrate deploy && npm run start
    