#!/bin/sh
set -e

echo "Generating .env file from environment variables..."

# Generate .env from environment variables
cat > /app/.env << EOF
NODE_ENV=${NODE_ENV:-production}
PORT=${PORT:-3000}
URL=${URL:-http://localhost:3000}
SECRET=${SECRET:-topSecret51}
CORS=${CORS:-true}
TYPE=${TYPE:-postgres}
SSL=${SSL:-false}
DB_NAME=${DB_NAME:-api-navecopa}
DB_PORT=${DB_PORT:-5432}
DB_HOST=${DB_HOST:-localhost}
DB_USER=${DB_USER:-postgres}
DB_PASS=${DB_PASS:-postgres}
DB_SYNC=${DB_SYNC:-false}
DB_MIGRATIONS_RUN=${DB_MIGRATIONS_RUN:-true}
LOGGER=${LOGGER:-true}
LOGGER_LEVELS=${LOGGER_LEVELS:-error,warn,log}
EOF

# Add email config if present
if [ -n "$EMAIL_SMTP" ]; then
cat >> /app/.env << EOF
EMAIL_SMTP=${EMAIL_SMTP}
EMAIL_PORT=${EMAIL_PORT:-465}
EMAIL_SECURE=${EMAIL_SECURE:-true}
EMAIL_ID=${EMAIL_ID}
EMAIL_PASS=${EMAIL_PASS}
EMAIL_FROM=${EMAIL_FROM}
EOF
fi

echo ".env file generated successfully."

# Execute the main command
exec "$@"
