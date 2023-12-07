import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';

test('initial state', () => {
  const { getByPlaceholderText } = render(<App />);
  const input = getByPlaceholderText('Enter Wikipedia page name');
  expect(input.value).toBe('');
});

test('handleSearch', async () => {
  const { getByPlaceholderText, getByText } = render(<App />);
  const input = getByPlaceholderText('Enter Wikipedia page name');
  fireEvent.change(input, { target: { value: 'React' } });
  const button = getByText('Search');
  fireEvent.click(button);
  expect(getByText('Loading...')).toBeInTheDocument();
});

test('handleSummarize', async () => {
  const { getByText } = render(<App />);
  const button = getByText('Summarize');
  fireEvent.click(button);
  expect(getByText('Loading...')).toBeInTheDocument();
});

test('randomizePage', async () => {
  const { getByText } = render(<App />);
  const button = getByText('Randomize');
  fireEvent.click(button);
  expect(getByText('Loading...')).toBeInTheDocument();
});

test('error handling', async () => {
  const { getByText } = render(<App />);
  const button = getByText('Search');
  fireEvent.click(button);
  expect(getByText('Failed to search. Please try again.')).toBeInTheDocument();
});

test('input validation', async () => {
  const { getByPlaceholderText, getByText } = render(<App />);
  const input = getByPlaceholderText('Enter Wikipedia page name');
  fireEvent.change(input, { target: { value: '' } });
  const button = getByText('Search');
  fireEvent.click(button);
  expect(getByText('Please enter a Wikipedia page name.')).toBeInTheDocument();
});
