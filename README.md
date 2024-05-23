
# Descripción

# Ejecutar en DEV

1. Clonar el repositorio
2. Crear una copia del archivo ```.env.template``` y renombrarlo por ```.env```
3. Cambiar las variables de entorno del archivo ```.env```
4. Instalas dependencias ```npm install```
5. Levantar la base de datos ```docker compose up -d```
6. Correr las migraciones de Primsa ```npx prisma migrate dev```
7. Ejecutar seed ```npm run seed```
8. Limpiar el localStorage del navegador.
9. Correr el proyecto ```npm run dev```

## Ejecutar en PRO

