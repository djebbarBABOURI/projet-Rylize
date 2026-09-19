# Image de l'API Rylize (backend Node.js)
FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY backend ./backend

ENV NODE_ENV=production
EXPOSE 8000
USER node
CMD ["node", "backend/server.js"]
