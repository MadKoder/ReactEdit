import esprima from 'esprima';
import estraverse from 'estraverse';
import escodegen from 'escodegen';

// Adapt the expression to the store hierarchy
// The expression validity is also tested
export function adaptExpressionToStore(expression)
{
  let ast = null;
  try {
    ast = esprima.parse(expression).body[0];
  } catch(e) {
    // Expression cannot be parsed, don't do anything
    return null;
  }
  if(ast === undefined) {
    return null;
  }
  estraverse.replace(ast, {
      enter: function (node, parent) {
        if (node.type === 'Identifier') {
          // We don't want the new node to be traversed
          this.skip();
          // Replace node identifier (e.g. "x") by
          // "window.store.getState().vars.x.value"
          return {
            "type": "MemberExpression",
            "computed": false,
            "object": {
              "type": "MemberExpression",
              "computed": false,
              "object": {
                "type": "MemberExpression",
                "computed": false,
                "object": {
                  "type": "CallExpression",
                  "callee": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                      "type": "MemberExpression",
                      "computed": false,
                      "object": {
                        "type": "Identifier",
                        "name": "window"
                      },
                      "property": {
                        "type": "Identifier",
                        "name": "store"
                      }
                    },
                    "property": {
                      "type": "Identifier",
                      "name": "getState"
                    }
                  },
                  "arguments": []
                },
                "property": {
                  "type": "Identifier",
                  "name": "vars"
                }
              },
              "property": {
                "type": "Identifier",
                "name": node.name
              }
            },
            "property": {
              "type": "Identifier",
              "name": "value"
            }
          }
        }
      },
      leave: function (node, parent) {
      }
  });

  // Test the expression, it may be invalid
  let expressionString = escodegen.generate(ast);
  try {
    (window.execScript || window.eval)(expressionString);
    return expressionString;
  } catch(e) {
    return null;
  }
}

export function evalExpressionString(expressionString) {
  let adaptedExpressionString = adaptExpressionToStore(expressionString);
  if(adaptedExpressionString !== null) {
    // Test the expression, it may be invalid
    try {
      return (window.execScript || window.eval)(adaptedExpressionString);
    } catch(e) {
      return null;
    }
  }
  return null;
}
