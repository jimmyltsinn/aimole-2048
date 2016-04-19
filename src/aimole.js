// require external dependency socket.io, https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
(function(global){
	'use strict';

	let parseParams = () => {
		let vars = window.location.hash.replace(/^#/, '').split('&');
		let params = {};
		for(let i = 0, l = vars.length; i < l; i++) {
			if(vars[i] !== '') {
				let pair = vars[i].split('=');
				if(pair[0]) params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
			}
		}
		return params;
	}

	let eventEmitter = () => {
		let events = {}
		let emitter = {
			on: (eventName, func) => {
				let listeners = events[eventName] = events[eventName] || [];
				listeners.push(func);
			},
			off: (eventName, func) => {
				let listeners = events[eventName] || [];
				let index = listeners.indexOf(func);
				if (index == -1) return;
				listeners.splice(index, 1);
			},
			emit: (eventName, ...args) => {
				let listeners = events[eventName];
				if (!listeners || !listeners.length) return;
				listeners.forEach(func => func(...args));
			}
		}
		return emitter;
	}

	let aimole = parseParams();
	// console.log('aimole', aimole);
	let emitter = eventEmitter();
	aimole.on = emitter.on;
	aimole.off = emitter.off;
	aimole.emit = emitter.emit;
	if (aimole.display && !aimole.simulateStreaming) {
		try {
			aimole.display = JSON.parse(aimole.display);
		} catch (err) {
			console.error(err, 'JSON string: ' + aimole.display);
			aimole.display = [];
		}
		// console.log('aimole.display', aimole.display);
	} else if (aimole.display && aimole.simulateStreaming) {
		let display = aimole.display;
		aimole.display = [];
		try {
			display = JSON.parse(display);
		} catch (err) {
			console.error(err, 'JSON string: ' + display);
			display = [];
		}
		let events = [
			{eventName: 'queueing'},
			{eventName: 'start'}
		]
		.concat(display.map(data => {return {eventName: 'display', args: [data]};}))
		.concat([
			{eventName: 'end'},
			{eventName: 'disconnect', args: ['io server disconnect']},
		]);
		events.forEach( (event, index) => {
			setTimeout( () => {
				if (event.eventName === 'display'){
					aimole.display.push(event.args[0]);
				}
				if (event.args)
					aimole.emit(event.eventName, ...event.args);
				else
					aimole.emit(event.eventName);
			}, (index + 1) * 200);
		});
		// console.log('aimole.simulateStreaming', events);
	} else if (aimole.streamUrl && aimole.matchId) {
		aimole.display = [];
		io(aimole.streamUrl, {query: 'matchId=' + aimole.matchId})
			.on('queueing', () => {
				aimole.emit('queueing');
			})
			.on('start', () => {
				aimole.emit('start');
			})
			.on('display', (data) => {
				aimole.display.push(data);
				aimole.emit('display', data);
			})
			.on('err', (errMsg) => {
				aimole.emit('error', new Error(errMsg));
			})
			.on('end', () => {
				aimole.emit('end');
			})
			.on('disconnect', (reason) => {
				aimole.emit('disconnect', reason);
			});
		// console.log('aimole.streamUrl', aimole.streamUrl, 'aimole.matchId', aimole.matchId);
	}

	// aimole.on('queueing', () => console.log('queueing'));
	// aimole.on('start', () => console.log('start'));
	// aimole.on('display', (data) => console.log('display', data));
	// aimole.on('end', () => console.log('end'));
	// aimole.on('disconnect', (reason) => console.log('disconnect', reason));

	// AMD support
	if (typeof define === 'function' && define.amd) {
		define(function () { return aimole; });
	// CommonJS and Node.js module support.
	} else if (typeof exports !== 'undefined') {
		// Support Node.js specific `module.exports` (which can be a function)
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = aimole;
		}
		// But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
		exports.aimole = aimole;
	} else {
		global.aimole = aimole;
	}
})(this);
