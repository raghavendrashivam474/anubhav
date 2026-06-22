import asyncio
import asyncpg


async def main():
    print("→ Attempting to connect with asyncpg...")
    try:
        conn = await asyncpg.connect(
            "postgresql://anubhav:anubhav_dev_pass@localhost:5433/anubhav_db"
        )
        user = await conn.fetchval("SELECT current_user")
        db = await conn.fetchval("SELECT current_database()")
        print(f"✓ SUCCESS — connected as '{user}' to database '{db}'")
        await conn.close()
    except Exception as e:
        print(f"✗ FAILED: {type(e).__name__}")
        print(f"  Message: {e}")


asyncio.run(main())