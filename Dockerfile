# Use Ubuntu 22.04 LTS as base (supports Playwright browsers)
FROM ubuntu:22.04

# Install OS dependencies required by Playwright browsers
RUN apt-get update && \
    apt-get install -y \
        curl \
        git \
        gnupg \
        wget \
        ca-certificates \
        libatk-bridge2.0-0 \
        libatk1.0-0 \
        libc6 \
        libcairo2 \
        libcups2 \
        libdbus-1-3 \
        libdrm2 \
        libexpat1 \
        libgbm1 \
        libgl1 \
        libglib2.0-0 \
        libgtk-3-0 \
        libnspr4 \
        libnss3 \
        libnss3-dev \
        libpango-1.0-0 \
        libx11-6 \
        libx11-xcb1 \
        libxcb1 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxfixes3 \
        libxrandr2 \
        libxshmfence1 \
        libxtst6 \
        lsb-release \
        software-properties-common \
        xz-utils \
        zip \
        && rm -rf /var/lib/apt/lists/*

# Install Node.js (LTS) using NodeSource
ENV NODE_VERSION=20.13.1
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION%.*}.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package manifest files first (only package*.json, no .npmrc)
COPY package*.json ./

# Install npm dependencies
RUN npm ci --unsafe-perm

# Copy the rest of the application code
COPY . .

# Install Playwright browsers (Chromium, Firefox, WebKit)
RUN npx playwright install --with-browsers chromium firefox webkit

# Expose the default Next.js port
EXPOSE 3000

# Run the development server
CMD ["npm", "run", "dev"]