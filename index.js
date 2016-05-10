var
	assert       = require('assert'),
	crypto       = require('crypto'),
	EventEmitter = require('events').EventEmitter
	;

module.exports = function makeReceiver(opts)
{
	assert(opts && opts.secret, 'you must pass a shared secret in opts.secret');
	var secret = opts.secret;

	var handler = function handler(request)
	{
		var signature = request.headers['x-npm-signature'];
		if (!signature)
		{
			handler.emit('error', 'no x-npm-signature header found');
			return;
		}

		var expected = crypto.createHmac('sha256', secret).update(request._body).digest('hex');
		if (signature !== 'sha256=' + expected)
		{
			handler.emit('error', 'invalid payload signature found in x-npm-signature header');
			return;
		}

		var message = {
			event: request.body.event,
			type: request.body.type,
			name: request.body.name,
			sender: request.body.sender.username,
			payload: request.body.payload,
		};
		handler.emit(request.body.event, message);
		handler.emit('*', message);
	};

	handler.__proto__ = EventEmitter.prototype;
	EventEmitter.call(handler);
	return handler;
};
