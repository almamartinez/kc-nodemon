#NODEPOP
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
		