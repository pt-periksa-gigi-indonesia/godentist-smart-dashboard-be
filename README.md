# Backend PWA System
This project is the backend component of the Progressive Web Application (PWA) dashboard developed for Godentis. The backend system is designed to handle all server-side logic, database interactions, and API integrations required for the PWA dashboard to function effectively.

## Installation

Clone the repo:

```bash
git clone https://github.com/pt-periksa-gigi-indonesia/godentist-smart-dashboard-be.git
```

Install the dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

## Table of Contents

- [Features](#features)
- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Linting](#linting)

## Features

- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Authentication and authorization**: using [passport](http://www.passportjs.org)
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)
- **Testing**: unit and integration tests using [Jest](https://jestjs.io)
- **Error handling**: centralized error handling mechanism
- **API documentation**: with [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) and [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
- **Process management**: advanced production process management using [PM2](https://pm2.keymetrics.io)
- **Dependency management**: with [Yarn](https://yarnpkg.com)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
- **Docker support**
- **Git hooks**: with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
- **Editor config**: consistent editor configuration using [EditorConfig](https://editorconfig.org)

## Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start
```

Testing:

```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn coverage
```

Docker:

```bash
# run docker container in development mode
yarn docker:dev

# run docker container in production mode
yarn docker:prod

# run all tests in a docker container
yarn docker:test
```

Linting:

```bash
# run ESLint
yarn lint

# fix ESLint errors
yarn lint:fix

# run prettier
yarn prettier

# fix prettier errors
yarn prettier:fix
```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
# Port number
PORT=3000

# URL of the Mongo DB
MONGODB_URL=mongodb://127.0.0.1:27017/node-boilerplate

# Secret key for email
EMAIL_SECRET=email_secret

# API keys and secrets
API_KEY='your_api_key_here'

# HTTP API
# Base URL for the API
API_DOCTOR_URL='api_doctor_url_here'
API_FEEDBACK_URL='api_feedback_url_here'
API_PROFILE_URL='api_profile_url_here'
API_CLINIC_URL='api_clinic_url_here'
API_CONSULTATION_URL='api_consultation_url_here'
API_CLINIC_FEEDBACK_URL='api_clinic_feedback_url_here'
API_VERIFY_DOCTOR_URL='api_verify_doctor_url_here'

# URL FOR OCR DOCTOR CARD
API_OCR_DOCTOR_CARD_URL='api_url_ocr_here'

# JWT
# JWT secret key
JWT_SECRET=thisisasamplesecret
# Number of minutes after which an access token expires
JWT_ACCESS_EXPIRATION_MINUTES=30
# Number of days after which a refresh token expires
JWT_REFRESH_EXPIRATION_DAYS=30
# Number of minutes after which a reset password token expires
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
# Number of minutes after which a verify email token expires
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10

# SMTP configuration options for the email service
# For testing, you can use a fake SMTP service like Ethereal: https://ethereal.email/create
SMTP_HOST=email-server
SMTP_PORT=587
SMTP_USERNAME=email-server-username
SMTP_PASSWORD=email-server-password
EMAIL_FROM=support@yourapp.com
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--docs\           # Swagger files
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
```

## API Documentation

<details markdown=span>

**Base URL:**
> https://capstone-godentist-pwa-qlarjzkb3q-et.a.run.app/v1/

In this section there is a Collection API for this project that can be used to be main foundation of our dashboard. Response from each URL using JSON format. For further documentation and parameter can be used for each endpoint, please seek for this link [Swagger API Documentation](https://swagger-pwa-godentist-qlarjzkb3q-et.a.run.app/v1/docs/) or [Postman API Documentation](https://documenter.getpostman.com/view/34639993/2sA3XPE3N4) and if you running this project locally, you can access documentation in ```http://localhost:3000/v1/docs/```

### API Endpoints

List of available routes:

- #### **Auth routes:**
    ***Register :***\
    `POST /v1/auth/register`

    - <details markdown=span>

        <summary markdown=span><b>Request Body</b></summary>

        | Fieldname | Type     | Necessity    |
        | --------- | -------- | ------------ |
        | name | `string` | **required** |
        | email | `string` | **required** |
        | password | `string` | **required** |

        </details><br>

    - *Response :*
    ```JSON
    {
    "user": {
        "id": "5ebac534954b54139806c112",
        "email": "test@example.com",
        "name": "test name",
        "role": "user"
    },
    "tokens": {
        "access": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg",
        "expires": "2020-05-12T16:18:04.793Z"
        },
        "refresh": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg",
        "expires": "2020-05-12T16:18:04.793Z"
        }
    }
    }
    ```

    ***Login :***\
    `POST /v1/auth/login`

    - <details markdown=span>

        <summary markdown=span><b>Request Body</b></summary>

        | Fieldname | Type     | Necessity    |
        | --------- | -------- | ------------ |
        | email | `string` | **required** |
        | password | `string` | **required** |

        </details><br>

    - *Response :*
    ```JSON
    {
    "user": {
        "id": "5ebac534954b54139806c112",
        "email": "test@example.com",
        "name": "test name",
        "role": "user"
    },
    "tokens": {
        "access": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg",
        "expires": "2020-05-12T16:18:04.793Z"
        },
        "refresh": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg",
        "expires": "2020-05-12T16:18:04.793Z"
        }
    }
    }
    ```

    ***Logout :***\
    `POST /v1/auth/logout`

    - <details markdown=span>

        <summary markdown=span><b>Request Body</b></summary>

        | Fieldname | Type     | Necessity    |
        | --------- | -------- | ------------ |
        | refreshToken | `string` | **required** |

        </details><br>

    ***Refresh Auth Tokens :***\
    `POST /v1/auth/refresh-tokens`

    - <details markdown=span>

        <summary markdown=span><b>Request Body</b></summary>

        | Fieldname | Type     | Necessity    |
        | --------- | -------- | ------------ |
        | refreshToken | `string` | **required** |

        </details><br>

    - *Response :*
    ```JSON
    {
    "access": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg",
        "expires": "2020-05-12T16:18:04.793Z"
    },
    "refresh": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg",
        "expires": "2020-05-12T16:18:04.793Z"
    }
    }
    ```

    ***Forgot Password :***\
    `POST /v1/auth/forgot-password`

    - <details markdown=span>

        <summary markdown=span><b>Parameter</b></summary>

        | Fieldname | Type     | Necessity    | Description |
        | --------- | -------- | ------------ | ----------- |
        | token | `string` | **required** | The reset password token |

        </details><br>

    - <details markdown=span>

        <summary markdown=span><b>Request Body</b></summary>

        | Fieldname | Type     | Necessity    |
        | --------- | -------- | ------------ |
        | refreshToken | `string` | **required** |

        </details><br>

    ***Reset Password :***\
    `POST /v1/auth/reset-password`

    - <details markdown=span>

        <summary markdown=span><b>Request Body</b></summary>

        | Fieldname | Type     | Necessity    |
        | --------- | -------- | ------------ |
        | password | `string` | **required** |

        </details><br>

    ***Send Verification Email :***\
    `POST /v1/auth/send-verification-email`

    ***Verify Email :***\
    `POST /v1/auth/verify-email`

    - <details markdown=span>

        <summary markdown=span><b>Parameter</b></summary>

        | Fieldname | Type     | Necessity    | Description |
        | --------- | -------- | ------------ | ----------- |
        | token | `string` | **required** | The verify email token |

        </details><br>

- #### **Seed routes:**
    ***Refresh Database with Seeding Data :***\
    `GET /v1/seed`

    - *Response :*
    ```JSON
    {
    "massage": "Database successfully seeded"
    }
    ```

- #### **User routes:**
    ***Create a User :***\
    `POST /v1/users`

    - <details markdown=span>

        <summary markdown=span><b>Request Body</b></summary>

        | Fieldname | Type     | Necessity    |
        | --------- | -------- | ------------ |
        | name | `string` | **required** |
        | email | `string` | **required** |
        | password | `string` | **required** |
        | role | `string` | **required** |

        </details><br>

    - *Response :*
    ```JSON
    {
    "id": "5ebac534954b54139806c112",
    "email": "test@example.com",
    "name": "test name",
    "role": "user"
    }
    ```

    ***Get All Users :***\
    `GET /v1/users`

    - <details markdown=span>

        <summary markdown=span><b>Parameter</b></summary>

        | Fieldname | Type     | Necessity    | Description |
        | --------- | -------- | ------------ | ----------- |
        | name | `string` | **optional** | Filter users by name |
        | role | `string` | **optional** | Filter users by role |
        | sortBy | `string` | **optional** | Sort users by a specific field |
        | limit | `integer` | **optional** | Maximum number of users to retrieve |
        | page | `integer` | **optional** | Page number |

        </details><br>

    - *Response :*
    ```JSON
    {
    "results": [
        {
        "id": "5ebac534954b54139806c112",
        "email": "test@example.com",
        "name": "test name",
        "role": "user"
        }
    ],
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "totalResults": 1
    }
    ```

    ***Get Users :***\
    `GET /v1/users/:userId`
    - <details markdown=span>

        <summary markdown=span><b>Parameter</b></summary>

        | Fieldname | Type     | Necessity    | Description |
        | --------- | -------- | ------------ | ----------- |
        | userId | `string` | **required** | The user ID |

        </details><br>

    - *Response :*
    ```JSON
    {
    "id": "5ebac534954b54139806c112",
    "email": "test@example.com",
    "name": "test name",
    "role": "user"
    }
    ```

    ***Update Users :***\
    `PATCH /v1/users/:userId`
    - <details markdown=span>

        <summary markdown=span><b>Parameter</b></summary>

        | Fieldname | Type     | Necessity    | Description |
        | --------- | -------- | ------------ | ----------- |
        | userId | `string` | **required** | The user ID |

        </details><br>

    - <details markdown=span>

        <summary markdown=span><b>Request Body</b></summary>

        | Fieldname | Type     | Necessity    |
        | --------- | -------- | ------------ |
        | name | `string` | **optional** |
        | email | `string` | **optional** |
        | password | `string` | **optional** |

        </details><br>

    - *Response :*
    ```JSON
    {
    "id": "5ebac534954b54139806c112",
    "email": "test@example.com",
    "name": "test name",
    "role": "user"
    }
    ```

    ***Delete Users :***\
    `DELETE /v1/users/:userId`
    - <details markdown=span>

        <summary markdown=span><b>Parameter</b></summary>

        | Fieldname | Type     | Necessity    | Description |
        | --------- | -------- | ------------ | ----------- |
        | userId | `string` | **required** | The user ID |

        </details><br>

    ***Verify Users :***\
    `PATCH /v1/users/verify/:userId`
    - <details markdown=span>

        <summary markdown=span><b>Parameter</b></summary>

        | Fieldname | Type     | Necessity    | Description |
        | --------- | -------- | ------------ | ----------- |
        | userId | `string` | **required** | The user ID |

        </details><br>

    - <details markdown=span>

        <summary markdown=span><b>Request Body</b></summary>

        | Fieldname | Type     | Necessity    |
        | --------- | -------- | ------------ |
        | role | `string` | **required** |

        </details><br>

    - *Response :*
    ```JSON
    {
    "id": "5ebac534954b54139806c112",
    "email": "test@example.com",
    "name": "test name",
    "role": "user"
    }
    ```
</details><br>

## Model Deployment using Compute Engine

This section provides an overview of the deployment setup for the OCR model using Google Cloud Compute Engine. The deployment leverages a virtual machine instance specifically configured to optimize the performance and reliability of the OCR model in a production environment.

### VM Instance Specification

- **Name:** ocr-model
- **Zone:** asia-southeast2-c
- **Machine Type:** e2-medium
- **CPU Platform:** Intel Broadwell
- **Architecture:** x86/64
- **GPUs:** None

## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

In this repo, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications. It also extends [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to turn off all rules that are unnecessary or might conflict with Prettier.

To modify the ESLint configuration, update the `.eslintrc.json` file. To modify the Prettier configuration, update the `.prettierrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.

To maintain a consistent coding style across different IDEs, the project contains `.editorconfig`