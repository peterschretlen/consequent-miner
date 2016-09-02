var assert = require('assert');
var miner = require('./index.js');
var _ = require('lodash');

var options = {
    loginterval: 3, 
    antecedent : ["lhs1"],
    exclusions : ["lhs2"] ,
    thresholds : {
        freq : 0
    }
};
    
miner.mine('./test.ldjson', options, function(err, summary){

    var rules = miner.generateRules(summary, options);
    _.map(rules, r => console.log(JSON.stringify(r)));
    assert.equal(16, rules.length);

    //can apply options at rule generation time
    options.exclusions.push("rhs3");
    rules = miner.generateRules(summary, options);
    _.map(rules, r => console.log(JSON.stringify(r)));
    assert.equal(12, rules.length);
   
    //put summary in tidy form
    var tidySummary = miner.tidySummary(summary);
    assert.equal(16, tidySummary.association.length);
    assert.equal(4, tidySummary.consequent.length);

});



