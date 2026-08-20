# LocalKart Fast Database Abstraction Layer
import os
import re
import sqlite3
from werkzeug.security import generate_password_hash
from backend.config import Config

USE_POSTGRES = os.environ.get('USE_POSTGRES', 'false').lower() == 'true'

if USE_POSTGRES:
    try:
        import psycopg2
        from psycopg2.extras import RealDictCursor
        conn_test = psycopg2.connect(Config.DATABASE_URL, connect_timeout=1)
        conn_test.close()
        print("[Database] Connected to PostgreSQL database 'localkart'")
    except Exception as e:
        USE_POSTGRES = False
        print(f"[Database] PostgreSQL connection failed ({e}). Operating in fast SQLite mode.")
else:
    print("[Database] Operating in fast SQLite mode.")

def get_db_connection():
    """Returns database connection instantly without network delays."""
    if USE_POSTGRES:
        import psycopg2
        return psycopg2.connect(Config.DATABASE_URL)
    else:
        db_dir = os.path.dirname(Config.SQLITE_DB_PATH)
        os.makedirs(db_dir, exist_ok=True)
        conn = sqlite3.connect(Config.SQLITE_DB_PATH, timeout=10.0)
        conn.row_factory = sqlite3.Row
        return conn

def init_db():
    """Initializes the database schema and sample seed data."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        schema_path = os.path.join(os.path.dirname(__file__), '..', 'database', 'schema.sql')
        sample_path = os.path.join(os.path.dirname(__file__), '..', 'database', 'sample_data.sql')

        sql_script = ""
        if os.path.exists(schema_path):
            with open(schema_path, 'r', encoding='utf-8') as f:
                sql_script += f.read() + "\n"

        if os.path.exists(sample_path):
            with open(sample_path, 'r', encoding='utf-8') as f:
                sql_script += f.read() + "\n"
                
        valid_hash = generate_password_hash('password123')
        sql_script = sql_script.replace('DEMO_HASH_PLACEHOLDER', valid_hash)

        if USE_POSTGRES:
            try:
                cursor.execute(sql_script)
                conn.commit()
                print("[Database] PostgreSQL schema and seed data loaded successfully.")
            except Exception as ex:
                print(f"[Database] PostgreSQL schema init warning: {ex}")
                conn.rollback()
        else:
            sqlite_script = sql_script
            sqlite_script = re.sub(r'DROP TABLE IF EXISTS (\w+) CASCADE;', r'DROP TABLE IF EXISTS \1;', sqlite_script)
            sqlite_script = sqlite_script.replace('SERIAL PRIMARY KEY', 'INTEGER PRIMARY KEY AUTOINCREMENT')
            sqlite_script = sqlite_script.replace('BOOLEAN DEFAULT TRUE', 'INTEGER DEFAULT 1')
            sqlite_script = sqlite_script.replace('BOOLEAN DEFAULT FALSE', 'INTEGER DEFAULT 0')
            sqlite_script = sqlite_script.replace('TRUE', '1').replace('FALSE', '0')
            sqlite_script = re.sub(r'DECIMAL\(\d+,\s*\d+\)', 'NUMERIC', sqlite_script)

            try:
                cursor.executescript(sqlite_script)
                conn.commit()
                print("[Database] SQLite database initialized successfully with sample tables and seed data.")
            except Exception as ex:
                print(f"[Database] SQLite schema init error: {ex}")
    finally:
        cursor.close()
        conn.close()

def query_db(query, args=(), one=False):
    """Executes a SELECT query and returns list of dictionary records."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if USE_POSTGRES:
            from psycopg2.extras import RealDictCursor
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            pg_query = query.replace('?', '%s')
            cursor.execute(pg_query, args)
            rv = cursor.fetchall()
            res = [dict(row) for row in rv]
            return (res[0] if res else None) if one else res
        else:
            cursor.execute(query, args)
            rv = cursor.fetchall()
            res = [dict(row) for row in rv]
            return (res[0] if res else None) if one else res
    finally:
        cursor.close()
        conn.close()

def execute_db(query, args=()):
    """Executes an INSERT/UPDATE/DELETE query and returns last inserted ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    last_id = None
    try:
        if USE_POSTGRES:
            pg_query = query.replace('?', '%s')
            if 'INSERT INTO' in pg_query.upper() and 'RETURNING' not in pg_query.upper():
                pg_query += ' RETURNING id'
                cursor.execute(pg_query, args)
                last_id = cursor.fetchone()[0]
            else:
                cursor.execute(pg_query, args)
            conn.commit()
        else:
            cursor.execute(query, args)
            last_id = cursor.lastrowid
            conn.commit()
        return last_id
    finally:
        cursor.close()
        conn.close()
