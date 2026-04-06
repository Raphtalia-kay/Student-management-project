# 1. Use Node.js image
FROM node:18

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy package files first
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy all project files
COPY . .

# 6. Expose port (your Express port)
EXPOSE 3000

# 7. Run your app
CMD ["npm", "start"]