"use strict";
exports.__esModule = true;
/**
 * Parse a JSON Uniform Response.
 *
 * @example
 * let response = new Jur;
 * response.parse('...');
 *
 * console.log( response.message, response.data );
 * @see https://github.com/khalyomede/jur
 */
var Jur = /** @class */ (function () {
    function Jur() {
        this.ERR_RESPONSE_NOT_PARSED_YET = 'Unable to access the property of the response before without parsing it.';
        this.ERR_UNIT_NOT_SUPPORTED = 'this unit is not supported.';
        this.ERR_ISSUED_TIME_NOT_SET = 'The issued time should be initialized first.';
        this.UNIT_MICROSECOND = 'microsecond';
        this.UNIT_MILLISECOND = 'millisecond';
        this.UNIT_SECOND = 'second';
        this.issued_at = null;
        this.response = {};
    }
    /**
     * Stores the time when the request has been sent.
     */
    Jur.prototype.issued = function () {
        this.issued_at = this.timestampInMicroseconds();
        return this;
    };
    /**
     * Parse the response.
     *
     * @throws {SyntaxError} If the response was not a valid JSON stirng.
     * @throws {Error} If the JSON string was not a valid Json Uniform Response.
     */
    Jur.prototype.parse = function (json) {
        this.response = JSON.parse(json);
        this.validateResponse();
        return this;
    };
    /**
     * Throw an Error exception if the object is not a valid JSON Uniform Response.
     *
     * @throws {Error} If the object is not a valid JSON Uniform Response.
     * @see https://github.com/khalyomede/jur
     */
    Jur.prototype.validateResponse = function () {
        var required = ['message', 'data', 'request', 'debug'];
        for (var _i = 0, required_1 = required; _i < required_1.length; _i++) {
            var key = required_1[_i];
            if (key in this.response === false) {
                throw new Error("The response is not a valid JUR (the attribute \"" + key + "\" is missing from the response).");
            }
        }
        required = ['elapsed', 'issued_at', 'resolved_at'];
        for (var _a = 0, required_2 = required; _a < required_2.length; _a++) {
            var key = required_2[_a];
            if (key in this.response['debug'] === false) {
                throw new Error("The response is not a valid JUR (the attribute \"" + key + "\" is missing from the attribute \"debug\").");
            }
        }
        var stringOrNull = ['message'];
        for (var _b = 0, stringOrNull_1 = stringOrNull; _b < stringOrNull_1.length; _b++) {
            var key = stringOrNull_1[_b];
            if (this.response[key] !== null && (this.response[key] === undefined || this.response[key].constructor !== String)) {
                throw new Error("The response is not a valid JUR (the attribute \"" + key + "\" must be either a string or null).");
            }
        }
        var types = ['get', 'post', 'put', 'patch', 'delete'];
        if (types.indexOf(this.response['request']) === -1) {
            throw new Error("The response is not a valid JUR (the attribute \"debug\" must have one of the following value: " + types.join(', ') + ").");
        }
        var numbers = ['elapsed', 'issued_at', 'resolved_at'];
        for (var _c = 0, numbers_1 = numbers; _c < numbers_1.length; _c++) {
            var key = numbers_1[_c];
            if (this.response['debug'][key] === null || this.response['debug'][key] === undefined || this.response['debug'][key].constructor !== Number) {
                throw new Error("The response is not a valid JUR (the attribute \"" + key + "\" of the attribute \"debug\" must be a number).");
            }
        }
    };
    /**
     * Return the message of the response.
     *
     * @throws {Error} If the response has not been parsed yet.
     */
    Jur.prototype.message = function () {
        this.checkResponseParsed();
        return this.response['message'];
    };
    /**
     * Return the request type of the response.
     *
     * @throws {Error} If the response has not been parsed yet.
     */
    Jur.prototype.request = function () {
        this.checkResponseParsed();
        return this.response['request'];
    };
    /**
     * Return the data from the response.
     *
     * @throws {Error} If the response has not been parsed yet.
     */
    Jur.prototype.data = function () {
        this.checkResponseParsed();
        return this.response['data'];
    };
    /**
     * Return the elapsed time in the desired unit.
     * By default it return this time in microseconds.
     *
     * @throws {Error} If the response has not been parsed yet.
     * @throws {Error} If the time unit is not supported.
     */
    Jur.prototype.elapsed = function (unit) {
        if (unit === void 0) { unit = this.UNIT_MICROSECOND; }
        return this.debugTime('elapsed', unit);
    };
    /**
     * Return the time when the request have been received by the server controller, in the desired unit.
     * By default, it return this time in microseconds.
     *
     * @throws {Error} If the response has not been parsed yet.
     * @throws {Error} If the time unit is not supported.
     */
    Jur.prototype.issuedAt = function (unit) {
        if (unit === void 0) { unit = this.UNIT_MICROSECOND; }
        return this.debugTime('issued_at', unit);
    };
    /**
     * Return the time when the request have been resolved by the server controlelr, in the desired unit.
     * By default, it return this time in microseconds.
     *
     * @throws {Error} If the response has not been parsed yet
     * @throws {Error} If the time unit is not supported.
     */
    Jur.prototype.resolvedAt = function (unit) {
        if (unit === void 0) { unit = this.UNIT_MICROSECOND; }
        return this.debugTime('resolved_at', unit);
    };
    /**
     * Return the response as an object.
     *
     * @throws {Error} If the response has not been parsed yet.
     */
    Jur.prototype.toObject = function () {
        this.checkResponseParsed();
        return this.response;
    };
    /**
     * Return the latency by computing the issued time from this class against the issued time of the server.
     * Bu default, return the latency in microseconds.
     *
     * @throws {Error} If the response has not been parsed yet.
     * @throws {Error} If the time unit is not supported.
     * @throws {Error} If the issued time has not been initialized.
     */
    Jur.prototype.latency = function (unit) {
        if (unit === void 0) { unit = this.UNIT_MICROSECOND; }
        this.checkResponseParsed();
        this.checkIssuedTimeFilled();
        this.checkTimeUnitValid(unit);
        var latency = this.issued_at - this.response['debug']['issued_at'];
        return this.convertTimeUnit(latency, unit);
    };
    /**
     * Throws an exception if the issued_at property has not been set with .issued() method.
     *
     * @throws {Error} If the issued time has not been initialized.
     */
    Jur.prototype.checkIssuedTimeFilled = function () {
        if (this.issued_at === null) {
            throw new Error(this.ERR_ISSUED_TIME_NOT_SET);
        }
    };
    /**
     * Return the desired debug time.
     *
     * @throws {Error} If the response has not been parsed yet.
     * @throws {Error} If the time unit is not supported.
     * @see https://github.com/khalyomede/jur
     */
    Jur.prototype.debugTime = function (key, unit) {
        this.checkResponseParsed();
        this.checkTimeUnitValid(unit);
        var time = this.response['debug'][key];
        return this.convertTimeUnit(time, unit);
    };
    /**
     * Convert a time unit relative to the time and the unit.
     */
    Jur.prototype.convertTimeUnit = function (time, unit) {
        var _time = time;
        switch (unit) {
            case this.UNIT_MILLISECOND:
                _time /= 1000;
                break;
            case this.UNIT_SECOND:
                _time /= 1000000;
                break;
        }
        return Math.round(_time);
    };
    /**
     * Throw an exception if the time unit provided is not supported.
     *
     * @throws {Error} If the time unit is not supported.
     */
    Jur.prototype.checkTimeUnitValid = function (unit) {
        if (this.supportedUnits().indexOf(unit.toLowerCase()) === -1) {
            throw new Error(this.ERR_UNIT_NOT_SUPPORTED);
        }
    };
    /**
     * Return the supported units.
     */
    Jur.prototype.supportedUnits = function () {
        return [
            this.UNIT_MICROSECOND,
            this.UNIT_MILLISECOND,
            this.UNIT_SECOND
        ];
    };
    /**
     * Throw an exception if the response has not been parsed yet.
     *
     * @throws {Error} If the response has not been parsed yet.
     */
    Jur.prototype.checkResponseParsed = function () {
        if (Object.keys(this.response).length === 0) {
            throw new Error(this.ERR_RESPONSE_NOT_PARSED_YET);
        }
    };
    /**
     * Return the current timestamp in microseconds.
     */
    Jur.prototype.timestampInMicroseconds = function () {
        return new Date().getTime() * 1000;
    };
    return Jur;
}());
exports["default"] = Jur;
