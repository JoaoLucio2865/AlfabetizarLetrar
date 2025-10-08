# Use uma imagem base do Node.js LTS (Long Term Support)
# Esta imagem já vem com Node.js e npm instalados
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos package.json e package-lock.json para o diretório de trabalho
# Isso permite que o Docker use o cache de camadas para a instalação de dependências
COPY package*.json ./

# Instala as dependências do projeto
# O --force é usado para garantir que o cache do npm seja ignorado se houver problemas
RUN npm install --force

# Copia o restante do código da aplicação para o diretório de trabalho
COPY . .

# Expõe a porta que o Vite usa para o servidor de desenvolvimento
EXPOSE 5173

# Comando para iniciar o servidor de desenvolvimento do Vite
# O --host 0.0.0.0 é crucial para que o servidor seja acessível de fora do contêiner
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]