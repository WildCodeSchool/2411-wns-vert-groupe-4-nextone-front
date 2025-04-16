FROM node

WORKDIR /app

COPY package.json package.json

RUN npm i
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*


COPY src src
COPY public public

COPY .env .
COPY tsconfig.json tsconfig.json
COPY tsconfig.app.json tsconfig.app.json
COPY tsconfig.node.json tsconfig.node.json
COPY vite.config.ts vite.config.ts
COPY index.html index.html

#COPY codegen.yml codegen.yml

EXPOSE 4000

# CMD npm run dev 
CMD npm run dev 

#& npm run codegen