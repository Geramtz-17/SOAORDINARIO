Arquitectura de Integración Híbrida y Modelo de Datos Unificado

El proyecto implementa una plataforma de gestión académica basada en una Arquitectura Orientada a Servicios (SOA). La solución se distingue por su enfoque heterogéneo (políglota), orquestando la interoperabilidad entre un subsistema administrativo desarrollado en Java (Spring Boot) bajo el estilo arquitectónico REST, y un subsistema transaccional desarrollado en Python (Spyne) utilizando el protocolo estándar SOAP.

Para garantizar la consistencia inmediata de la información y evitar la redundancia de datos (Data Duplication), se diseñó un modelo de Base de Datos Compartida (Shared Database Pattern) sobre MySQL.

La lógica de negocio se ha desacoplado según la naturaleza de las operaciones:

Módulo Administrativo (REST - Java): Responsable de la gestión de entidades maestras (Usuarios, Roles, Carreras). Se priorizó REST por su eficiencia en operaciones CRUD y su facilidad de consumo para clientes ligeros.

Módulo Transaccional (SOAP - Python): Responsable del proceso crítico de negocio (Inscripciones). Se seleccionó SOAP para aprovechar su robustez en la definición de contratos estrictos (WSDL), ideal para procesos de registro formal.

<img width="1920" height="1080" alt="Roles" src="https://github.com/user-attachments/assets/238b98ec-e8e5-4a8c-846a-eb57839b5542" />

Pruebas con Postman


<img width="1920" height="1080" alt="Captura de pantalla 2025-11-22 221652" src="https://github.com/user-attachments/assets/c9b68462-447a-435b-ac10-517148551792" />
<img width="1920" height="1080" alt="Captura de pantalla 2025-11-22 221150" src="https://github.com/user-attachments/assets/4e2a10c9-969a-4421-ba80-b596884fc9b2" />
<img width="1920" height="1080" alt="Captura de pantalla 2025-11-22 221132" src="https://github.com/user-attachments/assets/af8be4c5-f58d-48dc-aa77-c1ee71fd32c3" />
<img width="1920" height="1080" alt="Captura de pantalla 2025-11-22 215426" src="https://github.com/user-attachments/assets/840f37bd-066b-49d8-b90d-d2704d4d3042" />
