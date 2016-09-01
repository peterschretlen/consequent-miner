# consequent-miner
Mines association rules (if X -> then Y) when you know the antecedent or left hand side (X) but not the consequent or right hand side (Y)

# Input Format
The process takes a set of line-delimited JSON (LDJSON) objects. At the moment each object must be flat (no nested objects, though arrays are OK). 
For example:

```
{ "lhs1": "1" , "lhs2": "1" , "rhs1": "abc" , "rhs2" : "dog", 	"rhs3" : ["a", "b", "c", "d"] , "rhs4" : "dog" }
{ "lhs1": "2" , "lhs2": "2" , "rhs1": "xyz" ,                	"rhs3" : ["e", "f", "g", "h"]                  }
{ "lhs1": "3" , "lhs2": "3" , "rhs1": "abc" , "rhs2" : "bird", 	"rhs3" : ["i", "a", "b", "c"] , "rhs4" : "bird"}
{ "lhs1": "4" , "lhs2": "4" , "rhs1": "xyz" , "rhs2" : "fish", 	"rhs3" : ["d", "e", "f", "g"] , "rhs4" : "fish"}
{ "lhs1": "1" , "lhs2": "1" , "rhs1": "abc" , "rhs2" : "dog", 	"rhs3" : ["h", "i", "a", "b"]                  }
{ "lhs1": "2" , "lhs2": "2" , "rhs1": "xyz" ,                	"rhs3" : ["c", "d", "e", "f"] , "rhs4" : "cat" }
{ "lhs1": "3" , "lhs2": "3" , "rhs1": "abc" , "rhs2" : "bird", 	"rhs3" : ["g", "h", "i", "a"] , "rhs4" : "bird"}
{ "lhs1": "4" , "lhs2": "4" , "rhs1": "xyz" , "rhs2" : "fish", 	"rhs3" : ["b", "c", "d", "e"] , "rhs4" : "fish"}
{ "lhs1": "1" , "lhs2": "1" , "rhs1": "123" , "rhs2" : "rat", 	"rhs3" : ["f", "g", "h", "i"]                  }
{ "lhs1": "2" , "lhs2": "2" , "rhs1": "xyz" , "rhs2" : "cat", 	"rhs3" : ["a", "b", "c", "d"]                  }
```

# Output

The output is a set of association rules along with their signficance metrics. For the sample above, rules generated are:
```
{"if": "1" , "then": "rhs1", "freq": 3, "confidence": 1,  "lift":3.3,"ndistinct":2,"pdistinct":0.67}
{"if": "1" , "then": "rhs2", "freq": 3, "confidence": 1,  "lift":3.3,"ndistinct":2,"pdistinct":0.4}
{"if": "1" , "then": "rhs3", "freq": 3, "confidence": 1,  "lift":3.3,"ndistinct":8,"pdistinct":0.89}
{"if": "1" , "then": "rhs4", "freq": 1, "confidence": 0.3,"lift":3.3,"ndistinct":1,"pdistinct":0.25}
{"if": "2" , "then": "rhs1", "freq": 3, "confidence": 1,  "lift":3.3,"ndistinct":1,"pdistinct":0.33}
{"if": "2" , "then": "rhs3", "freq": 3, "confidence": 1,  "lift":3.3,"ndistinct":8,"pdistinct":0.89}
{"if": "2" , "then": "rhs4", "freq": 1, "confidence": 0.3,"lift":3.3,"ndistinct":1,"pdistinct":0.25}
{"if": "2" , "then": "rhs2", "freq": 1, "confidence": 0.3,"lift":3.3,"ndistinct":1,"pdistinct":0.2}
{"if": "3" , "then": "rhs1", "freq": 2, "confidence": 1,  "lift":5,  "ndistinct":1,"pdistinct":0.33}
{"if": "3" , "then": "rhs2", "freq": 2, "confidence": 1,  "lift":5,  "ndistinct":1,"pdistinct":0.2}
{"if": "3" , "then": "rhs3", "freq": 2, "confidence": 1,  "lift":5,  "ndistinct":6,"pdistinct":0.67}
{"if": "3" , "then": "rhs4", "freq": 2, "confidence": 1,  "lift":5,  "ndistinct":1,"pdistinct":0.25}
{"if": "4" , "then": "rhs1", "freq": 2, "confidence": 1,  "lift":5,  "ndistinct":1,"pdistinct":0.33}
{"if": "4" , "then": "rhs2", "freq": 2, "confidence": 1,  "lift":5,  "ndistinct":1,"pdistinct":0.2}
{"if": "4" , "then": "rhs3", "freq": 2, "confidence": 1,  "lift":5,  "ndistinct":6,"pdistinct":0.67}
{"if": "4" , "then": "rhs4", "freq": 2, "confidence": 1,  "lift":5,  "ndistinct":1,"pdistinct":0.25}
``` 
The [significance metrics](https://en.wikipedia.org/wiki/Association_rule_learning#Useful_Concepts) are: 
 - `freq` : how often the rule occurs.
 - `confidence` : how often (1 = 100% of the time) the rule holds true.
 - `lift` : the extent to which the antecedent and consequent are dependent on each other. A value of 1 indicated independence. A value > 1 indicates dependence.
 - `ndistinct` : how many distinct values for the consequent exist for this rule.
 - `pdistinct` : the proportion of all distinct values that exist for this rule.