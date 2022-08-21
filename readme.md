# Development Setup

## Install Node.JS v18

[Official Download](https://nodejs.org/en/download/current/)

Or use [Volta](https://volta.sh/) (preferred)


## Clone Repository

```bash
$ git clone https://github.com/olyop/musicloud.git
```

## Install Dependencies

```bash
$ cd musicloud
$ volta install
$ npm i
```

## Create `.env` file

```bash
$ cp .env.template .env
$ vim .env
```

Setup a PostgreSQL database and AWS S3 bucket and fill these out with you're own details:

```properties
AWS_REGION=""
AWS_ACCESS_KEY_ID=""
AWS_ACCESS_KEY_SECRET=""

POSTGRESQL_DATABASE=""
POSTGRESQL_USERNAME=""
POSTGRESQL_PASSWORD=""
POSTGRESQL_HOSTNAME=""

ALGOLIA_SEARCH_INDEX_NAME=""
ALGOLIA_APPLICATION_ID=""
ALGOLIA_ADMIN_API_KEY=""
ALGOLIA_SEARCH_API_KEY=""
```

If you want to use https in development, sign you're own certificate with `mkcert` using this [Guide](https://web.dev/how-to-use-local-https/) and set these environment variables:

```properties
HTTPS=true
TLS_CERTIFICATE_PATH=""
TLS_CERTIFICATE_KEY_PATH=""
```

## Start Development Server

```bash
$ npm start
```

## Build and test

Set `TESTING=true` in `.env`

```bash
$ npm run build
```