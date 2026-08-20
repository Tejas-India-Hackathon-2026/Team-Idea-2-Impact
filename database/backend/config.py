# LocalKart Backend Configuration Settings
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'localkart_secret_key_2026')
    
    # PostgreSQL Configuration
    POSTGRES_HOST = os.environ.get('POSTGRES_HOST', 'localhost')
    POSTGRES_PORT = os.environ.get('POSTGRES_PORT', '5432')
    POSTGRES_DB = os.environ.get('POSTGRES_DB', 'localkart')
    POSTGRES_USER = os.environ.get('POSTGRES_USER', 'postgres')
    POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD', 'postgres')

    DATABASE_URL = os.environ.get(
        'DATABASE_URL',
        f'postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}'
    )
    
    # Fallback SQLite DB file path
    SQLITE_DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'database', 'localkart.db')

    # Configurable Delivery Fee Pricing Tiers based on Distance (in Km)
    DELIVERY_FEE_TIERS = [
        {'max_km': 2.0, 'fee': 20.0, 'time': '20–30 mins'},
        {'max_km': 5.0, 'fee': 30.0, 'time': '30–45 mins'},
        {'max_km': 10.0, 'fee': 50.0, 'time': '45–60 mins'},
        {'max_km': 999.0, 'fee': 70.0, 'time': 'Same Day'}
    ]

    @staticmethod
    def calculate_delivery_fee(distance_km):
        """Returns delivery fee and estimated delivery time for a given distance."""
        for tier in Config.DELIVERY_FEE_TIERS:
            if distance_km <= tier['max_km']:
                return tier['fee'], tier['time']
        return 50.0, '45–60 mins'
