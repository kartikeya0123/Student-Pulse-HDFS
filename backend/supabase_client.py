import os
from dotenv import load_dotenv

load_dotenv()

supabase = None
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

try:
    from supabase import create_client, Client
    if url and key:
        supabase: Client = create_client(url, key)
        print(f"[Supabase] Connected to {url}")
    else:
        print("[Supabase] Missing SUPABASE_URL or SUPABASE_KEY in environment.")
except Exception as e:
    print(f"[Supabase] Could not initialize client: {e}")

def get_supabase_client():
    return supabase
