var byline = require('byline');
var fs = require('fs');
var through = require('through2');
var pipeline = require('pumpify');
var pipe = require('pump');
var _ = require('lodash');


function readByLine(file){
	return byline.createStream( fs.createReadStream(file) );
}

function deserializeJson() { 
	return through.obj(function (line, encoding, callback) {
		this.push( JSON.parse(line) );
		return callback();
	});
}

function count(size, msg) { 
	var count = 0;
	return through.obj(function (obj, encoding, callback) {
		count++;
		if(count % size == 0) console.log( msg, count );
		this.push(obj);
		return callback();
	});
}

function summarize( summary, options ) {

	return through.obj(function (obj, encoding, callback) {

		summary.transactions++;

		//build the antecedent key
		var antecedent = _( options.antecedent ).map( a => obj[a] ).value().join("|");

		//remove all antecedents to get list of consequent
		var consequent = _(obj).omit( _.concat(options.antecedent, options.exclusions )).value();

		var inc = function(o) {
			if(!o) 	return { freq : 1 };
			o.freq++;
			return o;
		};

		_.update( summary, 'antecedent.'+ antecedent, inc );

		_.mapKeys(consequent, function(v,k) {

			var distinct_values = function(a) {
				if(!a) return _.isArray(v) ? v : [v];
				return _.union(a, _.isArray(v) ? v : [v]); 
			};

			_.update( summary, 'consequent.'+ k, inc );
			_.update( summary, 'consequent.'+ k + '.values', distinct_values );
			_.update( summary, 'antecedent.'+ antecedent + '.consequent.' + k, inc );
			_.update( summary, 'antecedent.'+ antecedent + '.consequent.' + k + '.values', distinct_values );

		}); 

		this.push(obj);
		return callback();
	});

}

function sink() { 
	return through.obj(function (obj, encoding, callback) {
		return callback();
	});
}

function transform( summary, options ){

	return pipeline(  
				deserializeJson(),
			 	count(options.loginterval, "LOADED: "),
			 	summarize( summary, options ),
			   	sink()
			   	);
}

function measureSignificance(summary){

	/*
	*  process the summary to calculate
	* 
	*  support(X) 		= freq(X)/transactions
	*  confidence(X=>Y) = support(X & Y) / support(X)
	*  lift(X=>Y) 		= support(X & Y) / (support(X) * support(Y))
	* 
	*  ( See: https://en.wikipedia.org/wiki/Association_rule_learning )
	*/
	_.mapKeys( summary.consequent, function(v_consequent){
		v_consequent.support 	= v_consequent.freq / summary.transactions;
	});

	_.mapKeys( summary.antecedent, function(v_antecedent){
		v_antecedent.support = v_antecedent.freq / summary.transactions;
		_.mapKeys( v_antecedent.consequent, function(v_consequent, k_consequent) {
			v_consequent.support 	= v_consequent.freq / summary.transactions;
			v_consequent.confidence = v_consequent.support / v_antecedent.support;
			v_consequent.lift 		= v_consequent.support / ( v_consequent.support * v_antecedent.support );

			//how many distinct values for the consequent when this rules is applied?
			v_consequent.ndistinct  = v_consequent.values.length;

			//what proportion of all distinct values for the consequent are represented when this rules is applied?
			v_consequent.pdistinct  = v_consequent.ndistinct / summary.consequent[k_consequent].values.length;

		});
	});

}

function generateRules(summary, options){

	var rules = [];
	

	_.mapKeys( summary.antecedent, function(v_antecedent, k_antecedent){
		_.mapKeys( v_antecedent.consequent, function(v_consequent, k_consequent){

			var meets_all_thresholds = _.every(  _(options.thresholds).toPairs().map( function(threshold) {
				var threshold_name = threshold[0];
				var threshold_value = threshold[1];
				return v_antecedent.consequent[k_consequent][threshold_name] >= threshold_value;
			}).value() );



			if(!meets_all_thresholds) return;

			rules.push( { 
					"if": k_antecedent, 
					"then" : k_consequent , 
					"freq" : v_consequent.freq,
					"confidence" : v_consequent.confidence,
					"lift" : v_consequent.lift,
					"ndistinct" : v_consequent.ndistinct,
					"pdistinct" : v_consequent.pdistinct,
				});
		});
	});

	return rules;
}

var mineRules = function(file, options, cb){

	var summary = { antecedent: {}, consequent: {}, transactions :0 };

	return pipe( readByLine(file), transform(summary, options), function (err) {
		if (err) {
			console.error('error!', err);
			cb(err, []);
		}

		console.log("MEASURING SIGNFICANCE VALUES..." );
		measureSignificance(summary);

		console.log("GENERATING RULES..." );
		var rules = generateRules(summary, options);
		
		console.log("COMPLETED WITH ", rules.length, "RULES GENERATED" );
		cb(null, rules);

	});

};

module.exports.mine = mineRules;

