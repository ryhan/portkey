var fs = require('fs'),
	redisUrl = require('redis-url'),
	http = require('http'),
	nowjs = require('now');

var querystring = require('querystring');
var utils = require('utils');
	
// Connect Database
var redis = redisUrl.connect(process.env.REDISTOGO_URL);

var content = '';

//var linkTable = {};

var genString = function(){
	var vowels = ['a','e','i', 'o','u']; 
	var other=['b','c','d','f','g','h','j','k','l','m','n','p','r','s','t']; 
	var str = ''; 
	for(var i =0; i< 5; i++){ 
		str += other[Math.floor(Math.random()*other.length)]; 
		str+= vowels[Math.floor(Math.random()*vowels.length)];
	}

	/*
	if (linkTable[genString] != undefined){
		return genString();
	}*/

	return str;
};


var urllocation = 'http://portkeyapp.herokuapp.com';
//var urllocation = 'http://localhost:5000';

// Create Server
var server = http.createServer(function(req, response)
{
	// application routes
	var route = {
		'/': ['/html/index.html', 'text/html'],
		'/template': ['/html/template.html', 'text/html'],
		'/jquery.js': ['/js/jquery.js', 'text/javascript'],
		'/portkey.js': ['/js/portkey.js', 'text/javascript'],
		'/main.css': ['/css/main.css', 'text/css']
	}[req.url];

	if (route != undefined){
		var type = (route[1] || 'text/plain');
		fs.readFile(__dirname+route[0], function(err, data){
	      response.writeHead(200, {'Content-Type':type}); 
	      response.write(data);  
	      response.end();
		});
	}
	else{
		if (req.url.substring(0,2) == '//'){
			// special request handler
			var queryString = req.url.substring(2,req.url.length);

			console.log('Rendering page at ' + queryString);

			redis.get(queryString, function(err, content) {
			  	response.writeHead(200, "OK", {'Content-Type': 'text/html'});
				response.write('<!DOCTYPE html><html>');
		      	response.write(decodeURIComponent(content));
		      	response.write('</html>');
		      
		      	response.end();
			});
			/*
			var content = linkTable[queryString];

			response.writeHead(200, "OK", {'Content-Type': 'text/html'});
			response.write('<!DOCTYPE html><html>');
	      	response.write(decodeURIComponent(content));
	      	response.write('</html>');
	      
	      	response.end();
	      	*/

		}else if (req.url == '/api' && req.method == 'POST'){
			console.log("[200] " + req.method + " to " + req.url);
		    var fullBody = '';
		    
		    req.on('data', function(chunk) {
		      // append the current chunk of data to the fullBody variable
		      fullBody += chunk.toString();
		    });
		    
		    req.on('end', function() {

		    
		      // request ended -> do something with the data
		      response.writeHead(200, "OK", {'Content-Type': 'text/html'});
		      
		      // parse the received body data
		      var decodedBody = querystring.parse(fullBody);

		      content = decodedBody.content;

		      var newPath = genString();

		      var url = urllocation + '//' + newPath;

		      redis.set(newPath, content);

		      //linkTable[newPath] = content;

		      console.log('API REQUEST MADE');
		      console.log('PAIRED WITH ' + newPath);
		      //console.log(decodeURIComponent(content));


		      // output the decoded data to the HTTP response          
		      response.write('<html><head><title>Post data</title></head><body><a href="');
		      response.write(url);
		      response.write('">');
		      response.write(url);
		      response.write('</a></body></html>');
		      
		      response.end();
		    });
		}else{
			response.writeHead(404, {'Content-Type': 'text/plain'});
    		response.end("Page Could Not Be Found"); 
		}
	}

});

// Start Server
server.listen( process.env.PORT  || 8080);

// Intialize Now.js
//var everyone = nowjs.initialize(server);

/*
function project(name, link, image){
	this.name = name;
	this.link = link;
	this.image = image;
}

function queue(){

	this.list = [];

	var context = this;

	this.enq = function(obj){ context.list.push(obj);};
	this.deq = function(obj){ context.list.shift();};
}

var projects = new queue();
*/

/*
// Connect a user
nowjs.on('connect', function(){
	this.now.room = 'main';
	nowjs.getGroup(this.now.room).addUser(this.user.clientId);

	this.now.recieveContent(content);

});

// Disconnect a user
nowjs.on('disconnect', function(){

});
*/

/*
everyone.now.pushProject = function(projectObject){
	nowjs.getGroup(this.now.room).now.recieveProject(projectObject);
	projects.enq(projectObject);
	console.log('added project '+ projectObject.name);
}*/



/*
var redis = require('redis-url').connect(process.env.REDISTOGO_URL);

redis.set('foo', 'bar');

redis.get('foo', function(err, value) {
  console.log('foo is: ' + value);
});
*/