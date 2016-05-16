# npm-hook-receiver

Sample code showing you how to receive a package hook from the npm registry, verify its signature, and handle its payload. This module makes a restify server that you configure to receive hook payloads at whatever path you like. The server emits events when notifications arrive. Listen for the events to do something interesting! For example, it's easy to write a [Slack bot](https://github.com/npm/npm-hook-slack) that echoes events to a Slack channel.

## Usage

```js
var makeReceiver = require('@npmcorp/npm-hook-receiver');
var server = makeReceiver({
	secret: 'this-is-a-shared-secret',
	mount: '/hook'
});

server.on('hook', function(message)
{
	console.log(`got ${message.event} type ${message.type} on ${message.name}`);
	console.log(`object is in ${message.payload}`);
});

server.on('package:star', function(message)
{
	console.log(`package ${message.name} was starred by ${message.sender}!`);
});

server.listen(8080, function()
{
	console.log('Ready to receive hooks!');
});
```

## Events

* `hook`: emitted for all successfully-received notifications. Listen for this event to handle all hooks.
* `hook:error`: emitted on payload errors like missing or invalid signatures.
* An event is also emitted for each hook event string. E.g, listen for `package:star-removed` to handle only unstarring notifications.

See the npm hooks API documentation for the full list of events.

## License

ISC
