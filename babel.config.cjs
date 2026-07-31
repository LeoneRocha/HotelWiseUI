module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
  ],
  plugins: [
    function transformImportMetaForJest() {
      return {
        visitor: {
          MetaProperty(path) {
            if (
              path.node.meta.name === 'import' &&
              path.node.property.name === 'meta'
            ) {
              path.replaceWithSourceString(
                '({ url: "file://jest", hot: undefined, env: {} })',
              );
            }
          },
        },
      };
    },
  ],
};
