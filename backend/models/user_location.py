# LocalKart User Location Model
from backend.database import query_db, execute_db

class UserLocation:
    @staticmethod
    def save(user_id, pincode, locality, city, district, state, country, lat, lng, formatted_address):
        """Saves or updates user's default location in database."""
        if user_id:
            # Set other locations for this user as non-default
            execute_db("UPDATE user_locations SET is_default = 0 WHERE user_id = ?", (user_id,))
            
            existing = query_db("SELECT id FROM user_locations WHERE user_id = ? AND pincode = ?", (user_id, pincode), one=True)
            if existing:
                query = """
                    UPDATE user_locations
                    SET locality = ?, city = ?, district = ?, state = ?, country = ?, latitude = ?, longitude = ?, formatted_address = ?, is_default = 1, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                """
                execute_db(query, (locality, city, district, state, country, lat, lng, formatted_address, existing['id']))
                loc_id = existing['id']
            else:
                query = """
                    INSERT INTO user_locations (user_id, pincode, locality, city, district, state, country, latitude, longitude, formatted_address, is_default)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
                """
                loc_id = execute_db(query, (user_id, pincode, locality, city, district, state, country, lat, lng, formatted_address))

            # Also update user primary location
            execute_db("""
                UPDATE users
                SET pincode = ?, city = ?, state = ?, latitude = ?, longitude = ?
                WHERE id = ?
            """, (pincode, city, state, lat, lng, user_id))

            return UserLocation.get_by_id(loc_id)
        else:
            # Guest structured location response object
            return {
                'id': 0,
                'user_id': None,
                'pincode': pincode,
                'locality': locality,
                'city': city,
                'district': district,
                'state': state,
                'country': country or 'India',
                'latitude': lat,
                'longitude': lng,
                'formatted_address': formatted_address
            }

    @staticmethod
    def get_by_user_id(user_id):
        """Gets user's default saved location from database."""
        if not user_id:
            return None
        loc = query_db("SELECT * FROM user_locations WHERE user_id = ? AND is_default = 1 ORDER BY id DESC", (user_id,), one=True)
        if not loc:
            loc = query_db("SELECT * FROM user_locations WHERE user_id = ? ORDER BY id DESC", (user_id,), one=True)
        return loc

    @staticmethod
    def get_by_id(loc_id):
        return query_db("SELECT * FROM user_locations WHERE id = ?", (loc_id,), one=True)
