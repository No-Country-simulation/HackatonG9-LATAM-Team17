# Etapa 1: Build de la aplicación con Bun
FROM oven/bun:1 AS build
WORKDIR /app

# Copiar archivos de dependencias desde la subcarpeta financeai
COPY financeai/package.json financeai/bun.lock ./
RUN bun install

# Copiar el código fuente y compilar
COPY financeai/ .
RUN bun run build

# Etapa 2: Servidor Web Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]