FROM mcr.microsoft.com/playwright:v1.57.0-noble

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY playwright.config.ts /app/playwright.config.ts
COPY tests/ /app/tests/
COPY tsconfig.json /app/tsconfig.json

CMD ["npx", "playwright", "test"]
