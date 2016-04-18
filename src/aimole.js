var hash = window.location.hash.replace(/^#/, '');
var vars = hash.split('&');
var aimole = window.aimole = {};
for(var i = 0, l = vars.length; i < l; i++) {
	if(vars[i] !== '') {
		var pair = vars[i].split('=');
		if(pair[0]) aimole[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	}
}
try {
	aimole.display = JSON.parse(aimole.display);
} catch (e) {
	aimole.display = [];
}
