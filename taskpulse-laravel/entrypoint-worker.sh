#!/bin/sh
set -eu

if [ -z "${APP_KEY:-}" ]; then
	echo "ERROR: APP_KEY no definido. Configuralo en Render para web y worker."
	exit 1
fi

exec php artisan horizon
