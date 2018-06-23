# Jur.js

JSON Uniform Response for Javascript.

![GitHub tag](https://img.shields.io/github/tag/khalyomede/jur-js.svg)

## Summary

- [Installation](#installation)
- [Examples](#examples)

Json Uniform Response (JUR) is a way to deliver JSON REST API responses in a consistant manner, no matter the nature of the request. To know more, please read [the standard](https://github.com/khalyomede/jur).

This library implement version 2 of the standard.

## Installation

On your web page, include the following script (4 KB) right before the body tag ending or after your scripts:

```html
<script type="text/javascript" src="https://rawgit.com/khalyomede/jur-js/v0.1.0/dist/jur.min.js"></script>
```

## Examples

- [Parse and get the response in the form of an object](#parse-and-get-the-response-in-the-form-of-an-object)
- [Fetch a property](#fetch-a-property)
- [Fetch time properties in different unit of time](#fetch-time-properties-in-different-unit-of-time)
- [Fetch the latency](#fetch-the-latency)

### Parse and get the response in the form of an object

```javascript
const RESPONSE = '{"message":null,"request":"get","data":[{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}],"debug":{"elapsed":27,"issued_at":1529617930807795,"resolved_at":1529617930807822}}';

let response = new Jur().parse(RESPONSE);

console.log( response.toObject() );
```

```javascript
{ 
  message: null,
  request: 'get',
  data: [ 
    { id: 1, name: 'New in PHP 7.2', author: 'Carlo Daniele' },
    { id: 2, name: 'Help for new PHP project', author: 'Khalyomede' } 
  ],
  debug: { 
    elapsed: 27,
    issued_at: 1529617930807795,
    resolved_at: 1529617930807822 
  } 
}
```

### Fetch a property

```javascript
const RESPONSE = '{"message":null,"request":"get","data":[{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}],"debug":{"elapsed":27,"issued_at":1529617930807795,"resolved_at":1529617930807822}}';

let response = new Jur().parse(RESPONSE);

console.log( response.data() );
```

```javascript
[ 
  { id: 1, name: 'New in PHP 7.2', author: 'Carlo Daniele' },
  { id: 2, name: 'Help for new PHP project', author: 'Khalyomede' } 
]
```

You can use the following methods to extract all of the JUR properties:

- `.message()`
- `.request()`
- `.data()`
- `.elapsed()`
- `.issuedAt()`
- `.resolvedAt()`

### Fetch time properties in different unit of time

These are all the methods that are related to time:

- `.elapsed()`
- `.issuedAt()`
- `.resolvedAt()`
- `.latency()`

```javascript
const RESPONSE = '{"message":null,"request":"get","data":[{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}],"debug":{"elapsed":27,"issued_at":1529617930807795,"resolved_at":1529617930807822}}';

let response = new Jur().parse(RESPONSE);

console.log( response.issuedAt('second') );
console.log( response.issuedAt('millisecond') );
console.log( response.elapsed() );
console.log( response.elapsed('microsecond') );
```

```javascript
1529617931
1529617930808
27
27
```

As you can see, without any parameter, the time is returned in microseconds.

_This is possible thanks to the [standard](https://github.com/khalyomede/jur) that enforce the time to be returned as microseconds._

### Fetch the latency

The latency is the gap in time between the moment you sent a request to the endpoint and the moment the server received the request.

```javascript
const RESPONSE = '{"message":null,"request":"get","data":[{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}],"debug":{"elapsed":27,"issued_at":1529617930807795,"resolved_at":1529617930807822}}';

let response = new Jur().issued();

// ... Making an ajax request here ...

response.parse(RESPONSE);

console.log( response.latency('second') );
```

```javascript
94034
```

_I have a high latency because I use a very old response generated some days ago. In real, you should have only few milliseconds of latency._