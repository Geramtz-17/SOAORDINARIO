from flask import Flask
from flask_cors import CORS
from spyne.application import Application
from spyne.decorator import srpc
from spyne.model.primitive import String, Integer
from spyne.protocol.soap import Soap11
from spyne.server.flask import FlaskService
from spyne.service import ServiceBase
from db_connection import get_connection

app = Flask(__name__)
CORS(app)

class MatriculaService(ServiceBase):
    @srpc(Integer, String, String, _returns=String)
    def registrar_alumno(matricula, nombre, apellido):
        conn = None
        try:
            conn = get_connection()
            with conn.cursor() as cursor:
                cursor.execute("SELECT matricula FROM alumno WHERE matricula = %s", (matricula,))
                if cursor.fetchone():
                    return f"Error: La matrícula {matricula} ya existe."
                
                sql = "INSERT INTO alumno (matricula, nombre, apellido) VALUES (%s, %s, %s)"
                cursor.execute(sql, (matricula, nombre, apellido))
            
            conn.commit()
            return f"Alumno {nombre} {apellido} con matrícula {matricula} registrado con éxito."

        except Exception as e:
            if conn:
                conn.rollback()
            return f"Error en la base de datos al registrar: {str(e)}" 
        finally:
            if conn:
                conn.close()


    @srpc(Integer, _returns=String)
    def consultar_alumno(matricula):
        conn = None
        try:
            conn = get_connection()
            with conn.cursor() as cursor:
                sql = "SELECT matricula, nombre, apellido FROM alumno WHERE matricula = %s"
                cursor.execute(sql, (matricula,))
                alumno = cursor.fetchone()

            if not alumno:
                return f"<alumno><error>Matrícula {matricula} no encontrada</error></alumno>"
            
            return (
                f"<alumno>"
                f"<matricula>{alumno['matricula']}</matricula>"
                f"<nombre>{alumno['nombre']}</nombre>"
                f"<apellido>{alumno['apellido']}</apellido>"
                f"</alumno>"
            )

        except Exception as e:
            return f"Error en la base de datos al consultar: {str(e)}"
        finally:
            if conn:
                conn.close()


    @srpc(Integer, String, String, _returns=String)
    def editar_alumno(matricula, nuevo_nombre, nuevo_apellido):
        conn = None
        try:
            conn = get_connection()
            with conn.cursor() as cursor:
                sql = "UPDATE alumno SET nombre = %s, apellido = %s WHERE matricula = %s"
                cursor.execute(sql, (nuevo_nombre, nuevo_apellido, matricula))
                
                if cursor.rowcount == 0:
                    return f"Error: Matrícula {matricula} no encontrada para editar."
            
            conn.commit()
            return f"Alumno {matricula} actualizado a {nuevo_nombre} {nuevo_apellido}."

        except Exception as e:
            if conn:
                conn.rollback()
            return f"Error en la base de datos al editar: {str(e)}"
        finally:
            if conn:
                conn.close()


soap_app = Application([MatriculaService],
    tns='spyne.examples.matricula',
    in_protocol=Soap11(validator='lxml'),
    out_protocol=Soap11()
)

FlaskService(soap_app).bind(app, '/soap')