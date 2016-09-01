var assert = require('assert');
var miner = require('./index.js');

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
    assert.equal(16, rules.length);
    
});



