import React from 'react';

export default function MockDatePicker(props) {
  return React.createElement('input', { 'data-testid': 'mock-date-picker', ...props });
}
