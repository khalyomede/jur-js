const RESPONSE = '{"message":null,"request":"get","data":[{"id":1,"name":"New in PHP 7.2","author":"Carlo Daniele"},{"id":2,"name":"Help for new PHP project","author":"Khalyomede"}],"debug":{"elapsed":27,"issued_at":1529617930807795,"resolved_at":1529617930807822}}';

let response = new Jur().parse(RESPONSE);

console.log( response.data() );