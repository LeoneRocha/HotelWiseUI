// Mock simples para react-date-picker para Jest
const React = require('react');
function MockDatePicker(props) {
  return React.createElement('input', { 'data-testid': 'mock-date-picker', ...props });
}
module.exports = MockDatePicker;
module.exports.__esModule = true;
module.exports.default = module.exports;
