# 🛒 E-commerce API con NestJS + Prisma + PostgreSQL + Docker

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/MichDevZ/Api-ecommerce-nestjs.git
cd Api-ecommerce-nestjs
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Levantar PostgreSQL con docker
```bash
docker-compose up -d
```

### 4. Crear archivo .env para variables de entorno
Configurar 
```bash

DATABASE_URL=postgresql://ecommerce:ecommerce@localhost/ecommerce
JWT_SECRET="cualquier-secret-key"
```
### 6. Ejecutar migraciones Prisma
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 7. Crear seed para base de datos
```bash
npx ts-node prisma/seed.ts
```


### Correr el proyecto 
```bash
npm run start:dev
```
