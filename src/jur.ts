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
class Jur {
    readonly ERR_RESPONSE_NOT_PARSED_YET = 'Unable to access the property of the response before without parsing it.';
    readonly ERR_UNIT_NOT_SUPPORTED = 'this unit is not supported.';
    readonly ERR_ISSUED_TIME_NOT_SET = 'The issued time should be initialized first.';
    readonly UNIT_MICROSECOND = 'microsecond';
    readonly UNIT_MILLISECOND = 'millisecond';
    readonly UNIT_SECOND = 'second';

    /**
     * Stores the time when the request has been sent.
     */
    private issued_at: number;

    /**
     * Stores the raw JSON string response.
     */
    private response: object;

    constructor() {
        this.issued_at = null;
        this.response = {};
    }

    /**
     * Stores the time when the request has been sent.
     */
    public issued(): this {
        this.issued_at = this.timestampInMicroseconds();

        return this;
    }

    /**
     * Parse the response.
     * 
     * @throws {SyntaxError} If the response was not a valid JSON stirng.
     * @throws {Error} If the JSON string was not a valid Json Uniform Response.
     */
    public parse(json: string): this {
        this.response = JSON.parse(json);
        
        this.validateResponse();

        return this;
    }

    /**
     * Throw an Error exception if the object is not a valid JSON Uniform Response.
     * 
     * @throws {Error} If the object is not a valid JSON Uniform Response.
     * @see https://github.com/khalyomede/jur
     */
    private validateResponse(): void {
        let required = ['message', 'data', 'request', 'debug'];

        for( let key of required ) {
            if( key in this.response === false ) {
                throw new Error(`The response is not a valid JUR (the attribute "${key}" is missing from the response).`);
            }
        }

        required = ['elapsed', 'issued_at', 'resolved_at'];

        for( let key of required ) {
            if( key in this.response['debug'] === false ) {
                throw new Error(`The response is not a valid JUR (the attribute "${key}" is missing from the attribute "debug").`);
            }
        }

        const stringOrNull = ['message'];

        for( let key of stringOrNull ) {
            if( this.response[key] !== null && ( this.response[key] === undefined || this.response[key].constructor !== String ) ) {
                throw new Error(`The response is not a valid JUR (the attribute "${key}" must be either a string or null).`);
            }
        }

        const types = ['get', 'post', 'put', 'patch', 'delete'];

        if( types.indexOf(this.response['request']) === -1 ) {
            throw new Error(`The response is not a valid JUR (the attribute "debug" must have one of the following value: ${types.join(', ')}).`);
        }

        const numbers = ['elapsed', 'issued_at', 'resolved_at'];

        for( let key of numbers ) {
            if( this.response['debug'][key] === null || this.response['debug'][key] === undefined || this.response['debug'][key].constructor !== Number ) {
                throw new Error(`The response is not a valid JUR (the attribute "${key}" of the attribute "debug" must be a number).`);
            }
        }
    }

    /**
     * Return the message of the response.
     * 
     * @throws {Error} If the response has not been parsed yet.
     */
    public message(): string | null {
        this.checkResponseParsed();

        return this.response['message'];
    }

    /**
     * Return the request type of the response.
     * 
     * @throws {Error} If the response has not been parsed yet.
     */
    public request(): string {
        this.checkResponseParsed();

        return this.response['request'];
    }

    /**
     * Return the data from the response.
     * 
     * @throws {Error} If the response has not been parsed yet.
     */
    public data(): any {
        this.checkResponseParsed();

        return this.response['data'];
    }

    /**
     * Return the elapsed time in the desired unit.
     * By default it return this time in microseconds.
     * 
     * @throws {Error} If the response has not been parsed yet.
     * @throws {Error} If the time unit is not supported.
     */
    public elapsed(unit: string = this.UNIT_MICROSECOND): number {
        return this.debugTime('elapsed', unit);
    }

    /**
     * Return the time when the request have been received by the server controller, in the desired unit.
     * By default, it return this time in microseconds.
     * 
     * @throws {Error} If the response has not been parsed yet.
     * @throws {Error} If the time unit is not supported.
     */
    public issuedAt(unit: string = this.UNIT_MICROSECOND): number {
        return this.debugTime('issued_at', unit);
    }

    /**
     * Return the time when the request have been resolved by the server controlelr, in the desired unit.
     * By default, it return this time in microseconds.
     * 
     * @throws {Error} If the response has not been parsed yet
     * @throws {Error} If the time unit is not supported.
     */
    public resolvedAt(unit: string = this.UNIT_MICROSECOND): number {
        return this.debugTime('resolved_at', unit);
    }

    /**
     * Return the response as an object.
     * 
     * @throws {Error} If the response has not been parsed yet.
     */
    public toObject(): object {
        this.checkResponseParsed();

        return this.response;
    }

    /**
     * Return the latency by computing the issued time from this class against the issued time of the server.
     * Bu default, return the latency in microseconds.
     * 
     * @throws {Error} If the response has not been parsed yet.
     * @throws {Error} If the time unit is not supported.
     * @throws {Error} If the issued time has not been initialized.
     */
    public latency(unit: string = this.UNIT_MICROSECOND): number {
        this.checkResponseParsed();
        this.checkIssuedTimeFilled();
        this.checkTimeUnitValid(unit);

        let latency = this.issued_at - this.response['debug']['issued_at'];

        return this.convertTimeUnit(latency, unit);
    }

    /**
     * Throws an exception if the issued_at property has not been set with .issued() method.
     * 
     * @throws {Error} If the issued time has not been initialized.
     */
    private checkIssuedTimeFilled(): void {
        if( this.issued_at === null ) {
            throw new Error(this.ERR_ISSUED_TIME_NOT_SET);
        }
    }   

    /**
     * Return the desired debug time.
     * 
     * @throws {Error} If the response has not been parsed yet.
     * @throws {Error} If the time unit is not supported.
     * @see https://github.com/khalyomede/jur
     */
    private debugTime(key: string, unit: string): number {
        this.checkResponseParsed();
        this.checkTimeUnitValid(unit);

        let time = this.response['debug'][key];

        return this.convertTimeUnit(time, unit);
    }

    /**
     * Convert a time unit relative to the time and the unit.
     */
    private convertTimeUnit(time: number, unit: string): number {
        let _time = time;

        switch(unit) {
            case this.UNIT_MILLISECOND:
                _time /= 1_000;

                break;

            case this.UNIT_SECOND:
                _time /= 1_000_000;

                break;
        }

        return Math.round(_time);
    }

    /**
     * Throw an exception if the time unit provided is not supported.
     * 
     * @throws {Error} If the time unit is not supported.
     */
    private checkTimeUnitValid(unit: string): void {
        if( this.supportedUnits().indexOf(unit.toLowerCase()) === -1 ) {
            throw new Error(this.ERR_UNIT_NOT_SUPPORTED);
        }
    }

    /**
     * Return the supported units.
     */
    private supportedUnits(): string[] {
        return [
            this.UNIT_MICROSECOND,
            this.UNIT_MILLISECOND,
            this.UNIT_SECOND
        ];
    }

    /**
     * Throw an exception if the response has not been parsed yet.
     * 
     * @throws {Error} If the response has not been parsed yet.
     */
    private checkResponseParsed(): void {
        if( Object.keys(this.response).length === 0 ) {
            throw new Error(this.ERR_RESPONSE_NOT_PARSED_YET);
        }
    }

    /**
     * Return the current timestamp in microseconds.
     */
    private timestampInMicroseconds(): number {
        return new Date().getTime() * 1000;
    }
}