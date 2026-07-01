#!/bin/sh
set -eu

if [ -z "${APP_KEY:-}" ]; then
	echo "ERROR: APP_KEY no definido. Configuralo en Render para web y worker."
	exit 1
fi

php artisan migrate --force
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
