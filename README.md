#PRÁCTICA DevOps
##Ejercicio 1
Recusos estáticos servidos por NGINX:

* Imagen: <http://ec2-52-204-66-159.compute-1.amazonaws.com/images/bici.jpg>
* Documentación de la Nodemon: <http://ec2-52-204-66-159.compute-1.amazonaws.com/doc/>

En ambos casos he añadido la cabecera:

	X-Owner:  https://github.com/almamartinez

Si quieres probar la aplicación sin necesidad de logon:

**POST** http://ec2-52-204-66-159.compute-1.amazonaws.com/api/v1/pushtoken/

HEADERS: **x-lang: en | es**

**BODY:**	  formato x-www-form-urlencoded

|key		  |	value					  |
|:----------|:---------------------|
|plataforma |	android				  |
|token		  |	12345-blabla-probando |


##Ejercicio 2
Ip del servidor: <http://52.204.66.159/>

____
____

#PRÁCTICA NODEPOP
API para el mantenimiento de una web de anuncios de productos de segunda mano disponibles para la venta o que los usuarios buscan.

Permite registro de usuarios, acceso autenticado de usuarios, registro de tokens para Notificaciones Push,
tanto Android como iOS y búsquedas de anuncios con filtros.

##Carga Inicial de base de datos para hacer pruebas

		npm run instalDB

Los ficheros con la información que carga están en 

		nodepop/public/jsons.

Vacía las colecciones de **Anuncios** y **Usuarios** y carga el contenido de los ficheros: 
	
* anuncios.json
* usuarios.json
	
##Funcionamiento del API
La documentación del API se encuentra en la carpeta **/doc**, en el fichero **index.html**
	