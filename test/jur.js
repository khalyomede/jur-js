import { expect } from 'chai';
import Jur from './../lib/jur.node.js';

const VALID_RESPONSE = '{"message":null,"request":"get","data":[{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}],"debug":{"elapsed":27,"issued_at":1529617930807795,"resolved_at":1529617930807822}}';
const INVALID_RESPONSE = '{}';
const INVALID_RESPONSE_NO_MESSAGE = '{"request":"get","data":[{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}],"debug":{"elapsed":27,"issued_at":1529617930807795,"resolved_at":1529617930807822}}';
const INVALID_RESPONSE_NO_REQUEST = '{"message":null,"data":[{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}],"debug":{"elapsed":27,"issued_at":1529617930807795,"resolved_at":1529617930807822}}';
const INVALID_RESPONSE_NO_DEBUG = '{"message":null,"request":"get","data":[{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}]}';
const INVALID_RESPONSE_NO_ELAPSED = '{"message":null,"request":"get","data":[{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}],"debug":{"issued_at":1529617930807795,"resolved_at":1529617930807822}}';
const INVALID_RESPONSE_NO_ISSUED_AT = '{"message":null,"request":"get","data":[{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}],"debug":{"elapsed":27,"resolved_at":1529617930807822}}';
const INVALID_RESPONSE_NO_RESOLVED_AT = '{"message":null,"request":"get","data":[{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}],"debug":{"elapsed":27,"issued_at":1529617930807795}}';
const INVALID_RESPONSE_MESSAGE_INVALID = '{"message":2,"request":"get","data":[{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}],"debug":{"elapsed":27,"issued_at":1529617930807795,"resolved_at":1529617930807822}}';
const INVALID_RESPONSE_ELAPSED_INVALID = '{"message":null,"request":"get","data":[{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}],"debug":{"elapsed":null,"issued_at":1529617930807795,"resolved_at":1529617930807822}}';
const INVALID_RESPONSE_ISSUED_AT_INVALID = '{"message":null,"request":"get","data":[{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}],"debug":{"elapsed":27,"issued_at":null,"resolved_at":1529617930807822}}';
const INVALID_RESPONSE_RESOLVED_AT_INVALID = '{"message":null,"request":"get","data":[{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}],"debug":{"elapsed":27,"issued_at":1529617930807795,"resolved_at":null}}';
const ERR_MESSAGE_MISSING = 'The response is not a valid JUR (the attribute "message" is missing from the response).';
const ERR_REQUEST_MISSING = 'The response is not a valid JUR (the attribute "request" is missing from the response).';
const ERR_DEBUG_MISSING = 'The response is not a valid JUR (the attribute "debug" is missing from the response).';
const ERR_ELAPSED_MISSING = 'The response is not a valid JUR (the attribute "elapsed" is missing from the attribute "debug").';
const ERR_ISSUED_AT_MISSING = 'The response is not a valid JUR (the attribute "issued_at" is missing from the attribute "debug").';
const ERR_RESOLVED_AT_MISSING = 'The response is not a valid JUR (the attribute "resolved_at" is missing from the attribute "debug").';
const ERR_MESSAGE_INVALID = 'The response is not a valid JUR (the attribute "message" must be either a string or null).';
const ERR_ELAPSED_INVALID = 'The response is not a valid JUR (the attribute "elapsed" of the attribute "debug" must be a number).';
const ERR_ISSUED_AT_INVALID = 'The response is not a valid JUR (the attribute "issued_at" of the attribute "debug" must be a number).';
const ERR_RESOLVED_AT_INVALID = 'The response is not a valid JUR (the attribute "resolved_at" of the attribute "debug" must be a number).';

describe('JUR', function() {
    it('should exist', function() {
        expect(Jur).to.exist;
    });    

    describe('.issued()', function() {
        it('should return an instance of Jur when calling the "issued" method', function() {
            expect(new Jur().issued()).to.be.instanceOf(Jur);
        });
    });

    describe('.parse()', function() {
        it('should return an instance of Jur', function() {
            expect(new Jur().parse(VALID_RESPONSE)).to.be.instanceOf(Jur);
        });
    
        it('should throw an exception if the response is invalid', function() {
            expect(function() {
                new Jur().parse(INVALID_RESPONSE);
            }).to.throw(ERR_MESSAGE_MISSING);
        });
    
        it('should throw an exception if the message is missing', function() {
            expect(function() {
                new Jur().parse(INVALID_RESPONSE_NO_MESSAGE);
            }).to.throw(ERR_MESSAGE_MISSING);
        });
    
        it('should throw an exception if the request is missing', function() {
            expect(function() {
                new Jur().parse(INVALID_RESPONSE_NO_REQUEST);
            }).to.throw(ERR_REQUEST_MISSING);
        });
    
        it('should throw an exception if the debug attribute is missing', function() {
            expect(function() {
                new Jur().parse(INVALID_RESPONSE_NO_DEBUG);
            }).to.throw(ERR_DEBUG_MISSING);
        });

        it('should throw an exception if the elapsed attribute is missing from the debug attribute', function() {
            expect(function() {
                new Jur().parse(INVALID_RESPONSE_NO_ELAPSED);
            }).to.throw(ERR_ELAPSED_MISSING);
        });

        it('should throw an exception if the issued_at attribute is missing from the debug attribute', function() {
            expect(function() {
                new Jur().parse(INVALID_RESPONSE_NO_ISSUED_AT);
            }).to.throw(ERR_ISSUED_AT_MISSING);
        });

        it('should throw an exception if the resolved_at attribute is missing from the debug attribute', function() {
            expect(function() {
                new Jur().parse(INVALID_RESPONSE_NO_RESOLVED_AT);
            }).to.throw(ERR_RESOLVED_AT_MISSING);
        });

        it('should throw an exception if the message is not a string or null', function() {
            expect(function() {
                new Jur().parse(INVALID_RESPONSE_MESSAGE_INVALID);
            }).to.throw(ERR_MESSAGE_INVALID);
        });

        it('should throw an exception if the elapsed is not a number', function() {
            expect(function() {
                new Jur().parse(INVALID_RESPONSE_ELAPSED_INVALID)
            }).to.throw(ERR_ELAPSED_INVALID);
        });

        it('should throw an exception if the issued_at is not a number', function() {
            expect(function() {
                new Jur().parse(INVALID_RESPONSE_ISSUED_AT_INVALID)
            }).to.throw(ERR_ISSUED_AT_INVALID);
        });

        it('should throw an exception if the resolved_at is not a number', function() {
            expect(function() {
                new Jur().parse(INVALID_RESPONSE_RESOLVED_AT_INVALID)
            }).to.throw(ERR_RESOLVED_AT_INVALID);
        });
    });

    describe('.message()', function() {
        it('should throw an exception if no response has been parsed before', function() {
            expect(function() {
                new Jur().message();
            }).to.throw(Jur.ERR_RESPONSE_NOT_PARSED_YET);
        });

        it('should return the correct string message', function() {
            const response = '{"message":"hello world","request":"get","data":[{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}],"debug":{"elapsed":27,"issued_at":1529617930807795,"resolved_at":1529617930807822}}';

            expect(new Jur().parse(response).message()).to.be.equal('hello world');
        });

        it('should return the correct null message', function() {
            const response = '{"message":null,"request":"get","data":[{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}],"debug":{"elapsed":27,"issued_at":1529617930807795,"resolved_at":1529617930807822}}';

            expect(new Jur().parse(response).message()).to.be.equal(null);
        });
    });

    describe('.request()', function() {
        it('should throw an exception if no response has been parsed before', function() {
            expect(function() {
                new Jur().request();
            }).to.throw(Jur.ERR_RESPONSE_NOT_PARSED_YET);
        });

        it('should return the correct request', function() {
            expect(new Jur().parse(VALID_RESPONSE).request()).to.be.equal('get');
        });
    });

    describe('.data()', function() {
        it('should throw an exception if no response has been parsed before', function() {
            expect(function() {
                new Jur().data();
            }).to.throw(Jur.ERR_RESPONSE_NOT_PARSED_YET);
        });

        it('should return the data', function() {
            const data = [{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}];
            
            expect(new Jur().parse(VALID_RESPONSE).data()).to.be.deep.equal(data);
        });
    });

    describe('.elapsed()', function() {
        const ELAPSED = 27;

        it('should throw an exception if no response has been parsed before', function() {
            expect(function() {
                new Jur().elapsed();
            }).to.throw(Jur.ERR_RESPONSE_NOT_PARSED_YET);
        });

        it('should throw an exception if the unit is not supported', function() {
            expect(function() {
                new Jur().elapsed('foo');
            }).to.throw(Jur.ERR_UNIT_NOT_SUPPORTED);
        });

        it('should return the elapsed in microseconds by default', function() {
            expect(new Jur().parse(VALID_RESPONSE).elapsed()).to.be.equal(ELAPSED);
        });

        it('should return the elapsed time in microseconds if required in the parameter', function() {
            expect(new Jur().parse(VALID_RESPONSE).elapsed('microsecond')).to.be.equal(ELAPSED);
        });

        it('should return the elapsed time in milliseconds if required in the parameter', function() {
            expect(new Jur().parse(VALID_RESPONSE).elapsed('millisecond')).to.be.equal(Math.round(ELAPSED / 1000));
        });

        it('should return the elapsed time in seconds if required in the parameter', function() {
            expect(new Jur().parse(VALID_RESPONSE).elapsed('second')).to.be.equal(Math.round(ELAPSED / 1000000));
        });
    });

    describe('.issuedAt()', function() {
        const ISSUED_AT = 1529617930807795;

        it('should throw an exception if no response has been parsed before', function() {
            expect(function() {
                new Jur().issuedAt();
            }).to.throw(Jur.ERR_RESPONSE_NOT_PARSED_YET);
        });

        it('should throw an exception if the unit is not supported', function() {
            expect(function() {
                new Jur().issuedAt('foo');
            }).to.throw(Jur.ERR_UNIT_NOT_SUPPORTED);
        });

        it('should return the issued at time in microseconds by default', function() {
            expect(new Jur().parse(VALID_RESPONSE).issuedAt()).to.be.equal(ISSUED_AT);
        });

        it('should return the issued at time in microseconds if required in the parameter', function() {
            expect(new Jur().parse(VALID_RESPONSE).issuedAt('microsecond')).to.be.equal(ISSUED_AT);
        });

        it('should return the issued at time in milliseconds if required in the parameter', function() {
            expect(new Jur().parse(VALID_RESPONSE).issuedAt('millisecond')).to.be.equal( Math.round(ISSUED_AT / 1000) );
        });

        it('should return the issued at time in seconds if required in the parameter', function() {
            expect(new Jur().parse(VALID_RESPONSE).issuedAt('second')).to.be.equal( Math.round(ISSUED_AT / 1000000) );
        });
    });

    describe('.resolvedAt()', function() {
        const RESOLVED_AT = 1529617930807822;

        it('should throw an exception if no response has been parsed before', function() {
            expect(function() {
                new Jur().resolvedAt();
            }).to.throw(Jur.ERR_RESPONSE_NOT_PARSED_YET);
        });

        it('should throw an exception if the unit is not supported', function() {
            expect(function() {
                new Jur().resolvedAt('foo');
            }).to.throw(Jur.ERR_UNIT_NOT_SUPPORTED);
        });

        it('should return the resolved at time in microseconds by default', function() {
            expect(new Jur().parse(VALID_RESPONSE).resolvedAt()).to.be.equal(RESOLVED_AT);
        });

        it('should return the resolved at time in microseconds if required in the parameter', function() {
            expect(new Jur().parse(VALID_RESPONSE).resolvedAt('microsecond')).to.be.equal(RESOLVED_AT);
        });

        it('should return the resolved at time in milliseconds if required in the parameter', function() {
            expect(new Jur().parse(VALID_RESPONSE).resolvedAt('millisecond')).to.be.equal( Math.round(RESOLVED_AT / 1000) );
        });

        it('should return the resolved at time in seconds if required in the parameter', function() {
            expect(new Jur().parse(VALID_RESPONSE).resolvedAt('second')).to.be.equal( Math.round(RESOLVED_AT / 1000000) );
        });
    });

    describe('.toObject()', function() {
        it('should throw an exception if no response has been parsed before', function() {
            expect(function() {
                new Jur().toObject();
            }).to.throw(Jur.ERR_RESPONSE_NOT_PARSED_YET);
        });

        it('should return the object representing the response', function() {
            expect(new Jur().parse(VALID_RESPONSE).toObject()).to.be.deep.equal(JSON.parse(VALID_RESPONSE));
        });
    });

    describe('.latency()', function() {
        const issued_at = 1529617930807795;

        it('should throw an exception if no response has been parsed before', function() {
            expect(function() {
                new Jur().latency();
            }).to.throw(Jur.ERR_RESPONSE_NOT_PARSED_YET);
        });

        it('should throw an exception if the .issued() has not been called before', function() {
            expect(function() {
                new Jur().parse(VALID_RESPONSE).latency();
            }).to.throw(Jur.ERR_ISSUED_TIME_NOT_SET);
        });

        it('should throw an exception if the time unit is not supported', function() {
            expect(function() {
                new Jur().parse(VALID_RESPONSE).latency('foo');
            }).to.throw(Jur.ERR_UNIT_NOT_SUPPORTED);
        });

        it('should return the latency in microseconds by default', function() {            
            const response = new Jur().issued();
            const expected = (new Date().getTime() * 1000) - issued_at;
            const actual = response.parse(VALID_RESPONSE).latency();

            expect(actual).to.be.equal(expected);
        });

        it('should return the latency in microseconds if required in the parameter', function() {            
            const response = new Jur().issued();
            const expected = (new Date().getTime() * 1000) - issued_at;
            const actual = response.parse(VALID_RESPONSE).latency('microsecond');

            expect(actual).to.be.equal(expected);
        });

        it('should return the latency in milliseconds if required in the parameter', function() {            
            const response = new Jur().issued();
            const expected = Math.round(((new Date().getTime() * 1000) - issued_at) / 1000);
            const actual = response.parse(VALID_RESPONSE).latency('millisecond');

            expect(actual).to.be.equal(expected);
        });

        it('should return the latency in seconds if required in the parameter', function() {            
            const response = new Jur().issued();
            const expected = Math.round(((new Date().getTime() * 1000) - issued_at) / 1000000);
            const actual = response.parse(VALID_RESPONSE).latency('second');

            expect(actual).to.be.equal(expected);
        });
    });
});