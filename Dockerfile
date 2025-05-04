FROM node:20-alpine

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Instalar dependências de sistema necessárias
RUN apk add --no-cache \
    openssl \
    libstdc++ \
    bash

# Copiar arquivos de dependência do Node.js
COPY package*.json ./

# Instalar dependências do Node.js
RUN npm install

# Copiar todo o código para dentro do container
COPY . .

# Construir a aplicação
RUN yarn run build

# Executar migrações e rodar a aplicação
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && node dist/src/main.js"]

# Expor a porta
EXPOSE 3333
