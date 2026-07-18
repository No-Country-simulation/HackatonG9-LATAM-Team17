## 🛠️ Registro de Correcciones y Refactorización - Backend    

Este documento detalla las modificaciones críticas realizadas en la arquitectura del backend para corregir errores de compilación, estandarizar las convenciones del proyecto y garantizar la compatibilidad absoluta del entorno con Java 21 y Spring Boot 3.

1. Compatibilidad del Entorno y Dependencias (**pom.xml**)
 
* Corrección de Versión de Spring Boot: Se degradó la versión ficticia **4.0.7** a la versión estable **3.4.2** de Spring Boot. Las versiones 4.x aún no existen en el ecosistema oficial, lo que impedía a Maven descargar los artefactos del repositorio central.

* Sustitución de Starters Incorrectos:

* Se eliminó **spring-boot-starter-webmvc** (inexistente) y se reemplazó por el starter oficial **spring-boot-starter-web**.

* Se eliminaron las dependencias fragmentadas de test (**spring-boot-starter-data-jpa-test** y **spring-boot-starter-webmvc-test**) y se unificaron bajo el starter agnóstico oficial **spring-boot-starter-test**, el cual ya provee soporte completo para testing de controladores (MockMvc) y persistencia.

* Actualización Crítica de Lombok: Se forzó de forma manual la versión de Lombok a **1.18.34**. Las versiones previas generaban un error fatal en el compilador de Java (**com.sun.tools.javac.code.TypeTag :: UNKNOWN**) al no reconocer la estructura de los Java Records en conjunto con las APIs de procesamiento de anotaciones del JDK 21.

2. Convenciones de Código y Nomenclatura
 
* Paquetes en Minúsculas: Se refactorizaron los nombres de los paquetes base de la aplicación (de **saludFinanciera.finanzas.* ** a **saludfinanciera.finanzas.* **) siguiendo las directrices oficiales de convenciones de nombres de Java.

* Estandarización del Repositorio: Se renombró la interfaz **AnalisisRepository** a **AnalisisFinancieroRepository** para mantener una relación semántica directa de 1:1 con su entidad mapeada (**AnalisisFinanciero**).

* Modelos e Identificadores de Maven: Se corrigieron los errores de tipeo en el **artifactId** de Maven (cambiando **finazas** por **finanzas**) y se pasaron los identificadores a minúsculas (**saludfinanciera:finanzas**).

3. Adopción de Estructuras Inmutables (Java Records)

* Migración de DTOs: Las clases **AnalisisInputDTO**, **AnalisisOutputDTO** y **TransaccionDTO** fueron transformadas de clases mutables convencionales de Lombok (@Data) a Java Records nativos.

* Sintaxis de Acceso en Servicios: En la capa de lógica de negocio (**AnalisisService**), se adaptó la lectura de propiedades de los DTOs para utilizar los métodos de acceso autogenerados por los Records (ej. **input.transacciones()** en lugar de input.getTransacciones()). Esto garantiza la inmutabilidad de los datos que ingresan y egresan de la API.

* Serialización: Se mantuvo la estrategia global de Jackson para procesar de forma automática el mapeo entre las propiedades en **camelCase** de los Records y el formato **snake_case** requerido por el contrato del cliente JSON.

🚨 Estado Actual del Tablero (Trello)
* **[Sprint 1: Infraestructura Base]** ➡️ Mover a ✅ Hecho
 
* **[Configuración de POM y Dependencias]** ➡️ Mover a ✅ Hecho