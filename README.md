# invoice-gen

A Next.js application that provides an easy-to-use interface to generate invoices. It allows to track your working time and generate the invoices based on it.

Includes data management for the user, customers, projects, tracked time and invoices.

## Usage

The application is configured to run with a PostgreSQL database, but can be configured to other databases by changing the according line in the `schema.prisma` file.

The following environment variables need to be set:

- DATABASE_URL (database connection string)
- COOKIE_SIGNATURE_KEY (cookie signature secret)
- MAIL_HOST (mail server hostname)
- MAIL_PORT (mail server port)
- MAIL_USER (mail server username)
- MAIL_PASSWORD (mail server password)
- MAIL_FROM (mail sender address)

The mail configuration is used for account creation and recovery.
