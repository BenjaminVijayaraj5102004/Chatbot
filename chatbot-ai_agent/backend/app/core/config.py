from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Chatbot AI Agent API"
    database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/chatbot_db"
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"
    allowed_origins: str = "http://localhost:5173,http://localhost:19006"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


settings = Settings()
