# LocalKart SMS & WhatsApp Provider Service Abstraction
import os
import json
import base64
import urllib.request
import urllib.parse

class SmsService:
    @staticmethod
    def send_otp(phone: str, otp_code: str, channel: str = "sms"):
        """
        Dispatches a 6-digit OTP code to the given phone number using configured SMS / WhatsApp Provider.
        Supported Channels: 'sms', 'whatsapp'
        Supported Providers:
        - 'fast2sms' (India)
        - 'twilio' (Global SMS & WhatsApp)
        - 'msg91' (India)
        - 'meta_whatsapp' (Meta WhatsApp Cloud API)
        - 'console' / 'dev' (Logs OTP to server output for development testing)
        - 'none' / unset (Returns unconfigured error status)
        """
        provider = os.environ.get('SMS_PROVIDER', 'console').lower().strip()
        message = f"Your LocalKart verification OTP code is {otp_code}. Valid for 5 minutes. Do not share it with anyone."

        # Ensure standard phone format
        formatted_phone = phone if phone.startswith('+') else f"+91{phone.replace('+', '').strip()}"

        if provider in ['console', 'dev', 'test']:
            print(f"\n========================================================")
            print(f"[OTP SERVICE - DEV CONSOLE OUTPUT]")
            print(f"CHANNEL: {channel.upper()}")
            print(f"TO: {formatted_phone}")
            print(f"OTP CODE: {otp_code}")
            print(f"TEXT: \"{message}\"")
            print(f"========================================================\n")
            return True, f"OTP sent successfully via {channel.upper()} (Development mode: Logged to server console)"

        if channel == "whatsapp" or provider == "meta_whatsapp":
            # 1. Meta WhatsApp Cloud API Provider
            whatsapp_token = os.environ.get('WHATSAPP_TOKEN') or os.environ.get('META_WA_TOKEN')
            phone_number_id = os.environ.get('WHATSAPP_PHONE_ID') or os.environ.get('META_WA_PHONE_ID')

            if whatsapp_token and phone_number_id:
                try:
                    url = f"https://graph.facebook.com/v18.0/{phone_number_id}/messages"
                    clean_num = formatted_phone.replace('+', '').strip()
                    payload = {
                        "messaging_product": "whatsapp",
                        "to": clean_num,
                        "type": "template",
                        "template": {
                            "name": "otp_verification",
                            "language": {"code": "en_US"},
                            "components": [
                                {
                                    "type": "body",
                                    "parameters": [{"type": "text", "text": otp_code}]
                                }
                            ]
                        }
                    }
                    data = json.dumps(payload).encode('utf-8')
                    req = urllib.request.Request(url, data=data, method='POST')
                    req.add_header("Authorization", f"Bearer {whatsapp_token}")
                    req.add_header("Content-Type", "application/json")
                    with urllib.request.urlopen(req, timeout=8) as response:
                        if response.status in [200, 201]:
                            return True, "OTP sent successfully via WhatsApp Cloud API"
                except Exception as e:
                    print(f"[WhatsApp Cloud API Exception]: {e}")
                    return False, f"WhatsApp Provider Failure: {str(e)}"

        if provider == 'twilio':
            sid = os.environ.get('TWILIO_ACCOUNT_SID') or os.environ.get('SMS_API_KEY')
            token = os.environ.get('TWILIO_AUTH_TOKEN') or os.environ.get('SMS_API_SECRET')
            from_phone = os.environ.get('TWILIO_PHONE_NUMBER') or os.environ.get('SMS_SENDER_ID', '+18005550199')

            if not sid or not token:
                return False, "SMS service is not configured. Twilio credentials missing."
            try:
                url = f"https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json"
                
                target_from = f"whatsapp:{from_phone}" if channel == "whatsapp" else from_phone
                target_to = f"whatsapp:{formatted_phone}" if channel == "whatsapp" else formatted_phone

                data = urllib.parse.urlencode({
                    "From": target_from,
                    "To": target_to,
                    "Body": message
                }).encode('utf-8')

                req = urllib.request.Request(url, data=data, method='POST')
                auth_str = f"{sid}:{token}"
                auth_b64 = base64.b64encode(auth_str.encode('ascii')).decode('ascii')
                req.add_header("Authorization", f"Basic {auth_b64}")

                with urllib.request.urlopen(req, timeout=8) as response:
                    if response.status in [200, 201]:
                        return True, f"OTP sent successfully via Twilio ({channel.upper()})"
                    return False, "Twilio failed to dispatch message"
            except Exception as e:
                print(f"[Twilio Provider Exception]: {e}")
                return False, f"SMS/WhatsApp Provider Failure: {str(e)}"

        if provider == 'fast2sms':
            api_key = os.environ.get('SMS_API_KEY') or os.environ.get('FAST2SMS_API_KEY')
            if not api_key:
                return False, "SMS service is not configured. FAST2SMS API key missing."
            try:
                url = "https://www.fast2sms.com/dev/bulkV2"
                clean_num = formatted_phone.replace('+91', '').replace('+', '').strip()
                payload = {
                    "variables_values": otp_code,
                    "route": "otp",
                    "numbers": clean_num
                }
                data = json.dumps(payload).encode('utf-8')
                req = urllib.request.Request(url, data=data, method='POST')
                req.add_header("authorization", api_key)
                req.add_header("Content-Type", "application/json")
                with urllib.request.urlopen(req, timeout=8) as response:
                    res_body = response.read().decode('utf-8')
                    res_json = json.loads(res_body)
                    if res_json.get('return'):
                        return True, "OTP sent successfully via Fast2SMS"
                    return False, f"SMS Provider Error: {res_json.get('message', 'Failed to send SMS')}"
            except Exception as e:
                print(f"[Fast2SMS Provider Exception]: {e}")
                return False, f"SMS Provider Failure: {str(e)}"

        if provider == 'msg91':
            auth_key = os.environ.get('SMS_API_KEY') or os.environ.get('MSG91_AUTH_KEY')
            template_id = os.environ.get('SMS_API_SECRET') or os.environ.get('MSG91_TEMPLATE_ID')
            if not auth_key:
                return False, "SMS service is not configured. MSG91 Auth Key missing."
            try:
                clean_num = formatted_phone.replace('+', '').strip()
                url = f"https://control.msg91.com/api/v5/otp?template_id={template_id}&mobile={clean_num}&otp={otp_code}"
                req = urllib.request.Request(url, method='POST')
                req.add_header("authkey", auth_key)
                with urllib.request.urlopen(req, timeout=8) as response:
                    res_body = response.read().decode('utf-8')
                    res_json = json.loads(res_body)
                    if res_json.get('type') == 'success':
                        return True, "OTP sent successfully via MSG91"
                    return False, f"MSG91 Error: {res_json.get('message')}"
            except Exception as e:
                return False, f"SMS Provider Failure: {str(e)}"

        return False, "SMS service is not configured."
