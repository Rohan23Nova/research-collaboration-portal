# Database Setup

## Create the MySQL database

Run these commands **once** to set up the database user and schema.

### Option 1 — MySQL CLI (recommended)

```bash
# Open the MySQL shell
mysql -u root -p

# Inside the shell, run:
CREATE DATABASE IF NOT EXISTS research_portal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

# (Optional) Create a dedicated user instead of using root:
CREATE USER IF NOT EXISTS 'rcp_user'@'localhost' IDENTIFIED BY 'StrongPass@123';
GRANT ALL PRIVILEGES ON research_portal.* TO 'rcp_user'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

### Option 2 — one-liner

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS research_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

## Apply the schema (Phase 2+)

```bash
mysql -u root -p research_portal < database/schema.sql
```

## Seed demo data (Phase 2+)

```bash
mysql -u root -p research_portal < database/seed.sql
```

## Verify

```bash
mysql -u root -p -e "SHOW DATABASES;" | grep research_portal
```

## Update your .env

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root          # or rcp_user if you created one
DB_PASSWORD=<your_password>
DB_NAME=research_portal
```

## Common issues on macOS

| Problem | Fix |
|---------|-----|
| `command not found: mysql` | Install via Homebrew: `brew install mysql` then `brew services start mysql` |
| `Access denied for user 'root'@'localhost'` | Run `mysql_secure_installation` to set a root password |
| Port 3306 already in use | `brew services restart mysql` |
