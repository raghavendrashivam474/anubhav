from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # App
    APP_NAME: str = "Anubhav API"
    APP_ENV: str = "development"

    # Database
    DATABASE_URL: str

    # JWT
    JWT_SECRET_KEY: str = "anubhav-dev-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440

    # Groq
    GROQ_API_KEY: str


settings = Settings()