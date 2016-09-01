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
    
miner.mine('./test.ldjson', options, function(err, rules){

    //console.log(JSON.stringify(rules, null, 2));
    
    _.map(rules, r => console.log(JSON.stringify(r)));

    assert.equal(16, rules.length);
    
});



