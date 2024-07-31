import os
from pydantic_settings import BaseSettings
import dotenv

# Load .env file
dotenv.load_dotenv(dotenv_path='/app/.env')

class Settings(BaseSettings):
    API_BASE_URL: str = "https://api.videosdk.live"
    VIDEOSDK_TOKEN: str
    SUPABASE_URL: str
    SUPABASE_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()

# Print to verify environment variables
print(f"SUPABASE_URL: {settings.SUPABASE_URL}")
print(f"SUPABASE_KEY: {settings.SUPABASE_KEY}")
