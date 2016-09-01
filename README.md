# consequent-miner
Mines association rules (if X -> then Y) when you know the antecedent or left hand side (X) but not the consequent or right hand side (Y)

# Input Format
The process takes a set of line-delimited JSON (LDJSON) objects. At the moment each object must be flat (no nested objects, though arrays are OK). 
For example:

```
{ "lhs": "1" , "rhs1": "abc" , "rhs2" : "dog", 	"rhs3" : ["a", "b", "c", "d"] }
{ "lhs": "2" , "rhs1": "xyz" , "rhs2" : "cat", 	"rhs3" : ["e", "f", "g", "h"] }
{ "lhs": "3" , "rhs1": "abc" , "rhs2" : "bird", "rhs3" : ["i", "a", "b", "c"] }
{ "lhs": "4" , "rhs1": "xyz" , "rhs2" : "fish", "rhs3" : ["d", "e", "f", "g"] }
{ "lhs": "1" , "rhs1": "abc" , "rhs2" : "dog", 	"rhs3" : ["h", "i", "a", "b"] }
{ "lhs": "2" , "rhs1": "xyz" , "rhs2" : "cat", 	"rhs3" : ["c", "d", "e", "f"] }
{ "lhs": "3" , "rhs1": "abc" , "rhs2" : "bird", "rhs3" : ["g", "h", "i", "a"] }
{ "lhs": "4" , "rhs1": "xyz" , "rhs2" : "fish", "rhs3" : ["b", "c", "d", "e"] }
{ "lhs": "1" , "rhs1": "abc" , "rhs2" : "dog", 	"rhs3" : ["f", "g", "h", "i"] }
{ "lhs": "2" , "rhs1": "xyz" , "rhs2" : "cat", 	"rhs3" : ["a", "b", "c", "d"] }
```

