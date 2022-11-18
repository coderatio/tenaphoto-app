const { httpCode } = require('../constants/httpCode')
const {response} = require("express");

const template = {
    state: 'failed',
    statusCode: httpCode.NOT_FOUND,
    message: 'Not found',
    data: undefined,
}

exports.created = (response, message) => {
    template.statusCode = httpCode.CREATED
    template.state = 'success'
    template.message = message

    return response.status(httpCode.CREATED).json(template)
}

exports.success = (response, message, data = undefined) => {
    template.statusCode = httpCode.OK
    template.state = 'success'
    template.message = message
    template.data = data

    return response.status(httpCode.OK).json(template)
}

exports.failed = (response, message) => {
    template.statusCode = httpCode.BAD_REQUEST
    template.message = message

    return response.status(httpCode.BAD_REQUEST).json(template)
}

exports.notFound = (response, message) => {
    template.statusCode = httpCode.NOT_FOUND
    template.message = message
    template.state = 'failed'

    return response.status(httpCode.NOT_FOUND).json(template)
}

exports.badRequest = (response, message) => {
    template.statusCode = httpCode.BAD_REQUEST
    template.message = message
    template.state = 'failed'

    return response.status(httpCode.BAD_REQUEST).json(template)
}

exports.validation = (response, errors) => {
    template.message = 'Validation failed'
    template.state = 'failed'
    template.statusCode = httpCode.UNACCEPTABLE

    return response.status(httpCode.UNACCEPTABLE).json({ errors })
}

exports.unauthorized = (response, message) => {
    template.statusCode = httpCode.UNAUTHORIZED
    template.message = message

    return response.status(httpCode.UNAUTHORIZED).json(template)
}

exports.serverError = (response, message = 'Internal server error occured') => {
    template.message = message
    template.statusCode = httpCode.SERVER_ERROR

    return response.status(httpCode.SERVER_ERROR).json(template)
}

exports.build = ({ response, state, statusCode, message }, data = undefined) => {
    if (state) {
        template.state = state
    }

    if (statusCode) {
        template.statusCode = statusCode
    }

    template.message = message
    template.data = data

    return response.status(template.statusCode).json(template)
}