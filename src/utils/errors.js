export class APIError extends Error {
    constructor (statusCode, message, stack=[]) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.stack = stack;
        this.obj = { message: this.message, statusCode: this.statusCode };
    }
}
export class NotFoundError extends APIError {
    constructor(message) {
        super(404, `${message} not found`)
    }
}

export class UnauthorizedError extends APIError {
    constructor(message) {
        super(401, message);
    }
}

export class AuthenticationError extends APIError {
    constructor(message) {
        super(401, message);
    }
}

export class BadRequestError extends APIError {
    constructor(message) {
        super(400, message);
    }
}

export class ValidationError extends APIError {
    constructor(message) {
        super(422, message);
    }
}
