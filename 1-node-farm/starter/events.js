const EventEmitter = require('events');

const myEmitter = new EventEmitter();


myEmitter.on('event', (data) => {
    console.log('an event occurred!', data);
});


myEmitter.emit('event', {
    a: 'a',
    b: 'b'
});