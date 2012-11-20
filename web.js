var fs = require('fs'),
	redisUrl = require('redis-url'),
	http = require('http'),
	nowjs = require('now');
	
// Connect Database
var redis = redisUrl.connect(process.env.REDISTOGO_URL);

// Create Server
var server = http.createServer(function(req, response)
{
	var route = {
		'/': ['/html/index.html', 'text/html'],
		'/jquery.js': ['/js/jquery.js', 'text/javascript'],
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
		response.writeHead(404, {'Content-Type': 'text/plain'});
    	response.end("Page Could Not Be Found"); 
	}

});

// Start Server
server.listen( process.env.PORT  || 8080);

// Intialize Now.js
var everyone = nowjs.initialize(server);

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

// Connect a user
nowjs.on('connect', function(){
	this.now.room = 'main';
	nowjs.getGroup(this.now.room).addUser(this.user.clientId);

	var list = projects.list
	for(var i=0; i<list.length; i++){
		this.now.recieveProject(list[i]);
	}
});

// Disconnect a user
nowjs.on('disconnect', function(){

});

everyone.now.pushProject = function(projectObject){
	nowjs.getGroup(this.now.room).now.recieveProject(projectObject);
	projects.enq(projectObject);
	console.log('added project '+ projectObject.name);
}



/*
var redis = require('redis-url').connect(process.env.REDISTOGO_URL);

redis.set('foo', 'bar');

redis.get('foo', function(err, value) {
  console.log('foo is: ' + value);
});
*/