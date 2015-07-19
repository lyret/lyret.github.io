window.domReady = false;

var filmServiceCallback = {
	onDomReady: [],

	domReady: function() {
		window.domReady = true;
		for(var i = 0; i < filmServiceCallback.onDomReady.length; i++)
			filmServiceCallback.onDomReady[i]();
	}
};

if(document.addEventListener) {
	document.addEventListener("DOMContentLoaded", filmServiceCallback.domReady, false);
} else if(document.all && !window.opera) {
	var loader = document.getElementById('filmService_loadMonitor');

	if(!loader)
		document.write('<script type="text/javascript" id="filmService_loadMonitor" defer="defer" src="javascript:void(0)"><\/script>');

	loader = document.getElementById('filmService_loadMonitor');

	loader.onreadystatechange = function() {
		if (this.readyState == 'complete')
			filmServiceCallback.domReady();
	}
}


var FilmService = function(apiKey) {
	this.apiKey = apiKey;
	this.id = 'fs_'+(apiKey || 'xxxxx').substring(0, 5)+'_'+Math.random().toString().replace(/[\.,]/g,'');
	this.queue = [];

    this.initialize();
	/*if(window.domReady)
		this.initialize();
	else
		filmServiceCallback.onDomReady.append((this.bind(this.initialize)));*/
}

FilmService.prototype.isArray = function(obj) {
	if(!obj) return false;
	return (typeof obj == 'object') && (obj.toString().indexOf(',') >= 0);
}

FilmService.prototype.getAuthUrl = function(auth, target) {
	return ['http://www.filmtipset.se/login.cgi?accesskey=', this.apiKey, '&userkey=', auth, '&target=', encodeURIComponent(target) ].join('');
}

FilmService.prototype.constructUrl = function(action, auth, params, callback) {
	var base = 'http://www.filmtipset.se/api/api.cgi?accesskey='+this.apiKey+'&returntype=json&action='+action;

	if(callback)
		base += '&callback='+callback;

	if(auth) {
		if(typeof auth == 'number' || parseInt(auth).toString() == auth.toString())
			base += '&usernr='+auth;
		else
			base += '&userkey='+auth;
	}

	if(params) {
		var sparams = this.serialize(params);
		if(sparams.length > 0)
			base += '&'+sparams;
	}

	return base;
}

FilmService.prototype.initialize = function() {
	window.domReady = true;

	for(var i = 0; i < this.queue.length; i++) {
		var q = this.queue[i];
		this.get(q[0], q[1], q[2], q[3], q[4]);
	}

	this.queue = [];
}

FilmService.prototype.bind = function(method) {
	var context = this;
	return function() { method.apply(context) };
}

FilmService.prototype.serialize = function(obj) {
	var str = [];

	for(var i in obj) {
		if(str.length > 0)
			str.push('&');

		var hasChildren = typeof obj[i] == 'object' && (obj[i].toString().indexOf('object') >= 0 || this.isArray(obj[i]));
		if(!hasChildren) {
			str.push(i);
			str.push('=');
			str.push(encodeURIComponent(obj[i]));
		}
	}

	return str.join('');
}

FilmService.prototype.get = function(action, auth, params, success, error) {
	if(!this.apiKey && typeof error == 'function')
	{
		error('Access key not set');
		return;
	}

	if(!window.domReady) {
		this.queue.push([ action, auth, params, success, error ]);
		return;
	}

	var callback = null;
	var req = { action: action, auth: auth, params: params };

	if(typeof success == 'function') {
		var callbackId = 'callback_'+this.id+'_'+Math.random().toString().replace(/[\.,]/g, '');
		var callback = 'window.filmServiceCallback.'+callbackId;

		filmServiceCallback[callbackId] = function(res) { success(res[0], req); eval('delete '+callback); }
	}

	try {
		var url = this.constructUrl(action, auth, params, callback);

		var siteHead = document.getElementsByTagName("head")[0];         

		if(!siteHead)
			throw('Document HEAD tag is missing');

		var newScript = document.createElement('script');
		newScript.type = 'text/javascript';
		newScript.src = url;
		siteHead.appendChild(newScript);
	} catch(ex) {
		if(typeof error == 'function')
		{
			if(typeof ex == 'string')
				error(ex, req);
			else
				error(ex.message, req);
		}
	}
}