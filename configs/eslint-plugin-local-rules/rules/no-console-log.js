module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow the use of console.log',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [], // no options
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.object && node.callee.object.name === 'console' && node.callee.property.name === 'log') {
          context.report({
            node,
            message: 'Unexpected console.log statement. use "debugger" instead.',
          })
        }
      },
    }
  },
}
