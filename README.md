<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Conexa Test
Intrucciones para levantar el proyecto localmente
1. Clonar proyecto
2. ```npm install```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
4. Cambiar las variables de entorno
5. Levantar la base de datos (debemos tener docker desktop instalado).
```
docker-compose up -d
```

6. Levantar: ```nest start --watch```

7. Ejecutar SEED (Documentado en Swagger)
```
1
ejecutamos el endpoint para tener un usuario ADMIN 
http://localhost:3000/api/seed/admin
con dichas credenciales debemos loguearnos loguearnos 
(http://localhost:3000/api/auth/login)

2 
utilizando el token obtenido al logearnos, nos autorizamos y ejecutamos el siguiente seed, que hace una precarga de peliculas, a partir de la api publica de Star Wars.
http://localhost:3000/api/seed/movies
```
8. Testear el resto de los endpoints que fueron solicitados en Swagger.

# Api deployada

```

https://conexa-backend-test-pm5zvmdcta-rj.a.run.app/api

El deploy de la misma, se realizo en Google Cloud, con la herramienta Cloud Run para la cual se defino un Dockerfile. Finalmente la base de datos se encuentra en MongoAtlas.
```

# Comando para ejecutar los tests:

```

## Test
# unit tests
$ npm run test

```
# Funciones extra a las solicitadas

```

# Seed para la precarga de la base de datos.
# Paginado para el endpoint GET de las peliculas.
# Servicio para enviar Mails de bienvenida cuando se registra un nuevo usuario.

```
## Tecnologias utilizadas

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="50" alt="Nest Logo" /></a>
    <a href="http://nestjs.com/" target="blank"><img src="https://res.cloudinary.com/dqavzr8iu/image/upload/v1695796952/pngegg_1_b1hkpc.png" width="120" alt="Mongo" /></a>
    <a href="http://nestjs.com/" target="blank"><img src="https://res.cloudinary.com/dqavzr8iu/image/upload/v1695797082/pngegg_2_wtfbkd.png" width="60" alt="Gcloud" /></a>
  <a href="http://nestjs.com/" target="blank"><img src="https://res.cloudinary.com/dqavzr8iu/image/upload/v1695796821/pngegg_jm0gwt.png" width="100" alt="Gcloud" /></a>
</p>

## Contacto

- Author - [enzo sanchez](https://enzos-portfolio-react.vercel.app/)
- LinkdIn - [@Enzo Sanchez](https://www.linkedin.com/in/enzo-sanchez-733b85165/)

## License

Nest is [MIT licensed](LICENSE).
