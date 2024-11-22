const path = require('path');
const camelcase = require('camelcase');

module.exports = {
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename));

    if (filename.match(/\.svg$/)) {
      const pascalCaseFileName = camelcase(path.parse(filename).name, {
        pascalCase: true,
      });
      return `const React = require('react');
      module.exports = {
        __esModule: true,
        default: ${assetFilename},
        ReactComponent: React.forwardRef((props, ref) => {
          return {
            ...props,
            ref,
            children: ${assetFilename}
          };
        }),
      };`;
    }

    return `module.exports = ${assetFilename};`;
  },
};
