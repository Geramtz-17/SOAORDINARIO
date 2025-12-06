from wsgiref.simple_server import make_server
import os
import logging
from soap_service import app as soap_wsgi_app 

logging.basicConfig(level=logging.INFO)
host = os.getenv("HOST", "0.0.0.0")
port = int(os.getenv("SOAP_PORT", "8000")) 

if __name__ == "__main__":
    logging.info(f"Starting SOAP server at http://{host}:{port}/soap?wsdl") 
    server = make_server(host, port, soap_wsgi_app) 
    server.serve_forever()