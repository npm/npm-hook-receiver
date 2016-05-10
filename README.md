# npm-hook-receiver

Sample code showing you how to receive a package hook from the npm registry, verify its signature, and handle its payload.

## Usage

```js
var makeReceiver = require('@npmcorp/npm-hook-receiver');
var receiver = makeReceiver({ secret: 'this-is-a-shared-secret' });

receiver.on('*', function(hook)
{
	console.log(`got ${hook.event} type ${hook.type} on ${hook.name}`);
	console.log(`package is in ${hook.payload}`);
});

var server = restify.createServer();
server.post('/hooks', function(request, response, next)
{
	response.send(200, 'OK');
	next();
	receiver(request);
});
```

## Events

* `error`: emitted on payload errors like missing or invalid signatures.
* `*`: emitted for all received notifications. Listen for this event to handle all hooks.
* `package:change`: emitted for package change notifications.

## License

ISC
