var byline = require('byline');
var fs = require('fs');
var through = require('through2');
var pipeline = require('pumpify');
var pipe = require('pump');
var _ = require('lodash');


function readByLine(file){
	return byline.createStream( fs.createReadStream(file) );
};

function deserializeJson() { 
	return through.obj(function (line, encoding, callback) {
		this.push( JSON.parse(line) );
		return callback();
	});
};

function count(size, msg) { 
	var count = 0;
	return through.obj(function (obj, encoding, callback) {
		count++;
		if(count % size == 0) console.log( msg, count );
		this.push(obj);
		return callback();
	});
};

function log() { 
	return through.obj(function (obj, encoding, callback) {
		console.log( obj );
		this.push(obj);
		return callback();
	});
};

function summarize( summary ) {

	return through.obj(function (obj, encoding, callback) {

		var inc = function(o) {
			if(!o) 	return { freq : 1 }
			o.freq++;
			return o;
		}

		_.update( summary, 'antecedent.'+ obj.antecedent, inc );

		_.map(obj.values, function(v) {
			_.update( summary, 'consequent.'+ v, inc );
			_.update( summary, 'antecedent.'+ obj.antecedent + '.' + v, inc );

		}); 

		this.push(obj);
		return callback();
	});

}

function sink() { 
	return through.obj(function (obj, encoding, callback) {
		return callback();
	});
};




function transform( summary ){

	return pipeline(  
				deserializeJson(),
			 	count(1, "LOADED: "),
			 	summarize( summary ),
			   	log(),
			   	sink()
			   	);
}

var summary = { antecedent: {}, consequent: {} };

pipe( readByLine('./test.ldjson'), transform(summary), function (err) {
	if (err) 
		return console.error('error!', err);
	console.log('success');
	console.log(JSON.stringify(summary, null, 2));
})