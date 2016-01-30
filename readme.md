## Meeting Request Form

The form have the following fields:
- Name
- Email
- Message
- Available Date(s)

Available dates are any upcoming dates. Zero-to-many dates can be selected.
No double booking checks are implemented.

When a valid form is submitted it should:
- Display a confirmation message to the user
- Send an email to the form owner with the information (sent via SendGrid)
- Add the data to a MySql database.


### Framework

Laravel 5.2 framework is used with default project structure taken from laravel/laravel
repository. It is very verbose for such a small web app but it follows the general practice
when working with Laravel and it should be readable to a skilled professional.


### Setup

Install PHP and node.js dependencies:

    composer install
    npm install

Copy .env.example to .env and customize:

    cp .env.example .env
    php artisan key:generate
    # edit .env

Deploy database migrations:

    php artisan migrate

If running in production environment, enable optimizations:

    php artisan optimize
    php artisan config:cache
    php artisan route:cache


### Unit tests

- Framework smoketest (auto-generated)
- Implemented:
- Planned:

Run PHPUnit tests with:

    gulp phpUnit
