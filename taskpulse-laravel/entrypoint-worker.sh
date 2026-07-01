#!/bin/sh
set -eu

php artisan key:generate --force
php artisan horizon
