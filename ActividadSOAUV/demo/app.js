const REST_API_URL = 'http://127.0.0.1:8080/api/cursos';
const SOAP_ENDPOINT_URL = 'http://127.0.0.1:8000/soap';

async function callSoapService(soapAction, xmlBody, resultadoId) {
    try {
        const response = await fetch(SOAP_ENDPOINT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': `"${soapAction}"`
            },
            body: xmlBody
        });

        const resultText = await response.text();
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(resultText, "text/xml");
        
        const resultElement = xmlDoc.getElementsByTagName(`${soapAction}Result`)[0];
        const resultMessage = resultElement ? resultElement.textContent : resultText;

        document.getElementById(resultadoId).innerHTML = `Resultado: **${resultMessage}**`;
        
        return resultText;

    } catch (error) {
        document.getElementById(resultadoId).innerHTML = `Error al llamar a SOAP: Verifica el servidor Python en ${SOAP_ENDPOINT_URL}. Mensaje: ${error.message}`;
        throw error;
    }
}

document.getElementById('formAlumno').addEventListener('submit', async (e) => {
    e.preventDefault();

    const matricula = document.getElementById('matricula_registro').value; 
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const isEdit = document.getElementById('is_edit')?.checked || false; 
    
    const soapAction = isEdit ? 'editar_alumno' : 'registrar_alumno'; 
    const resultadoId = 'resultadoAlumnoRegistro';

    const xmlBody = 
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mat="spyne.examples.matricula">
            <soapenv:Header/>
            <soapenv:Body>
                <mat:${soapAction}>
                    <mat:matricula>${matricula}</mat:matricula>
                    <mat:nombre>${nombre}</mat:nombre>
                    <mat:apellido>${apellido}</mat:apellido>
                </mat:${soapAction}>
            </soapenv:Body>
        </soapenv:Envelope>`;

    await callSoapService(soapAction, xmlBody, resultadoId);
});

document.getElementById('formConsultaAlumno').addEventListener('submit', async (e) => {
    e.preventDefault();

    const matricula = document.getElementById('matricula_consulta').value; 
    if (!matricula) return;

    const soapAction = 'consultar_alumno';
    const resultadoId = 'resultadoAlumnoConsulta';
    const xmlBody = 
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mat="spyne.examples.matricula">
            <soapenv:Header/>
            <soapenv:Body>
                <mat:${soapAction}>
                    <mat:matricula>${matricula}</mat:matricula>
                </mat:${soapAction}>
            </soapenv:Body>
        </soapenv:Envelope>`;

    try {
        const resultText = await callSoapService(soapAction, xmlBody, resultadoId);
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(resultText, "text/xml");
        
        const resultadoElement = xmlDoc.getElementsByTagName('consultar_alumnoResult')[0];
        let resultadoHTML = '';

        if (resultadoElement) {
            const resultadoXmlString = resultadoElement.textContent;
            const innerParser = new DOMParser();
            const innerXmlDoc = innerParser.parseFromString(resultadoXmlString, "text/xml");
            
            const error = innerXmlDoc.getElementsByTagName('error')[0];
            
            if (error) {
                resultadoHTML = `<span style="color: red;">Error: ${error.textContent}</span>`;
            } else {
                const nombre = innerXmlDoc.getElementsByTagName('nombre')[0]?.textContent;
                const apellido = innerXmlDoc.getElementsByTagName('apellido')[0]?.textContent;
                const matriculaResultado = innerXmlDoc.getElementsByTagName('matricula')[0]?.textContent;
                
                resultadoHTML = `
                    **Resultado Consulta para Matrícula ${matriculaResultado}:**
                    <ul>
                        <li>Nombre: **${nombre}**</li>
                        <li>Apellido: **${apellido}**</li>
                    </ul>
                `;
            }
        } else {
            resultadoHTML = `<span style="color: red;">Error: Respuesta SOAP inesperada o vacía.</span>`;
        }
        
        document.getElementById(resultadoId).innerHTML = resultadoHTML;

    } catch (error) {
        
    }
});

// ******************************************************
// MÓDULO CURSOS (REST)
// ******************************************************

document.getElementById('formCurso').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('curso_nombre').value;
    const descripcion = document.getElementById('curso_descripcion').value;
    const fechaInicio = document.getElementById('curso_fecha_inicio').value;
    const fechaFin = document.getElementById('curso_fecha_fin').value;
    
    const cursoData = { nombre, descripcion, fechaInicio, fechaFin };

    try {
        const response = await fetch(REST_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cursoData)
        });

        const result = await response.json();
        
        if (response.ok) {
            document.getElementById('resultadoCursoRegistro').innerHTML = `Curso **${result.nombre}** creado con ID: ${result.id}.`;
        } else {
            document.getElementById('resultadoCursoRegistro').innerHTML = `Error al registrar: ${result.message || JSON.stringify(result)}`;
        }
    } catch (error) {
        document.getElementById('resultadoCursoRegistro').innerHTML = `Error de conexión REST: ${error.message}`;
    }
});

document.getElementById('formConsultaCursoId').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('curso_id_consulta').value;
    
    try {
        const response = await fetch(`${REST_API_URL}/${id}`);
        
        if (response.ok) {
            const curso = await response.json();
            document.getElementById('resultadoCursoConsulta').innerHTML = `
                **Curso ID ${curso.id}:**
                <ul>
                    <li>Nombre: ${curso.nombre}</li>
                    <li>Inicio: ${curso.fechaInicio}</li>
                </ul>
            `;
        } else if (response.status === 404) {
            document.getElementById('resultadoCursoConsulta').innerHTML = `Curso con ID ${id} no encontrado.`;
        } else {
            document.getElementById('resultadoCursoConsulta').innerHTML = `Error: ${response.status} - ${response.statusText}`;
        }
    } catch (error) {
        document.getElementById('resultadoCursoConsulta').innerHTML = `Error de conexión REST: ${error.message}`;
    }
});

document.getElementById('formEliminarCursoId').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('curso_id_eliminar').value;

    try {
        const response = await fetch(`${REST_API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.status === 204) {
            document.getElementById('resultadoCursoEliminar').innerHTML = `Curso con ID ${id} eliminado exitosamente (Status 204).`;
        } else if (response.status === 404) {
            document.getElementById('resultadoCursoEliminar').innerHTML = `Error: Curso con ID ${id} no encontrado.`;
        } else {
            const text = await response.text();
            document.getElementById('resultadoCursoEliminar').innerHTML = `Error al eliminar: ${response.status} - ${text}`;
        }
    } catch (error) {
        document.getElementById('resultadoCursoEliminar').innerHTML = `Error de conexión REST: ${error.message}`;
    }
});

document.getElementById('formEliminarCursoCriterio').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('curso_nombre_eliminar').value;
    const fecha = document.getElementById('curso_fecha_eliminar').value;

    if (!nombre && !fecha) {
        document.getElementById('resultadoCursoEliminarCriterio').innerHTML = `Debe proporcionar Nombre o Fecha de Inicio.`;
        return;
    }

    let query = '?';
    if (nombre) query += `nombre=${encodeURIComponent(nombre)}&`;
    if (fecha) query += `fechaInicioStr=${encodeURIComponent(fecha)}`;

    try {
        const response = await fetch(`${REST_API_URL}${query.endsWith('&') ? query.slice(0, -1) : query}`, {
            method: 'DELETE'
        });

        const text = await response.text();
        
        if (response.ok) {
            document.getElementById('resultadoCursoEliminarCriterio').innerHTML = `Eliminación exitosa: ${text}`;
        } else if (response.status === 404) {
            document.getElementById('resultadoCursoEliminarCriterio').innerHTML = `No se encontraron cursos que coincidan.`;
        } else {
            document.getElementById('resultadoCursoEliminarCriterio').innerHTML = `Error (${response.status}): ${text}`;
        }
    } catch (error) {
        document.getElementById('resultadoCursoEliminarCriterio').innerHTML = `Error de conexión REST: ${error.message}`;
    }
});