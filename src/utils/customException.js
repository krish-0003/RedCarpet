//400
class BadRequestError extends Error {
  constructor(message, field) {
    super(message);
    this.name = this.constructor.name;
    this.code = 400;
    this.field = field || null;
  }
}

//401
class UnauthorizedRequestError extends Error {
  constructor(message, field) {
    super(message);
    this.name = this.constructor.name;
    this.code = 401;
    this.field = field || null;
  }
}

//403
class ForbiddenRequestError extends Error {
  constructor(message, field) {
    super(message);
    this.name = this.constructor.name;
    this.code = 403;
    this.field = field || null;
  }
}

//404
class NotFoundError extends Error {
  constructor(message, field) {
    super(message);
    this.name = this.constructor.name;
    this.code = 404;
    this.field = field || null;
  }
}

//409
class ConflictError extends Error {
  constructor(message, field) {
    super(message);
    this.name = this.constructor.name;
    this.code = 409;
    this.field = field || null;
  }
}

//422
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = this.constructor.name;
    this.code = 422;
    this.field = field || null;
  }
}

//429
class TooManyRequestsError extends Error {
  constructor(message, field) {
    super(message);
    this.name = this.constructor.name;
    this.code = 429;
    this.field = field || null;
  }
}

//500
class InternalServerError extends Error {
  constructor(message, field) {
    super(message);
    this.name = this.constructor.name;
    this.code = 500;
    this.field = field || null;
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedRequestError,
  ForbiddenRequestError,
  NotFoundError,
  ConflictError,
  ValidationError,
  TooManyRequestsError,
  InternalServerError,
};
