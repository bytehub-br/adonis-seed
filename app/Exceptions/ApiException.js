'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')


class ApiException extends LogicalException {
  constructor(message, code, status = 400){
    super(message, status, code)
  }
}

module.exports = ApiException
