import os
import pymysql

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "uav"),
    "cursorclass": pymysql.cursors.DictCursor,
    "autocommit": False,
}

def get_connection():
    return pymysql.connect(**DB_CONFIG)