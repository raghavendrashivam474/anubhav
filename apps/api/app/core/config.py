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

    # Clerk Auth
    CLERK_SECRET_KEY: str
    CLERK_ISSUER: str
    CLERK_JWKS_URL: str

    # Groq
    GROQ_API_KEY: str


settings = Settings()