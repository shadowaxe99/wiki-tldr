import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
  const { container } = render(<App />);
  expect(container).not.toBeNull();
});

test('search functionality works as expected', async () => {
  const { getByPlaceholderText, getByText } = render(<App />);
  const searchInput = getByPlaceholderText('Enter Wikipedia page name');
  fireEvent.change(searchInput, { target: { value: 'React' } });
  expect(getByText('Summarizing...')).not.toBeNull();
  await waitFor(() => getByText('React (JavaScript library)'));
  expect(getByText('Summarize')).not.toBeNull();
});

test('randomize functionality works as expected', async () => {
  const { getByText } = render(<App />);
  const randomizeButton = getByText('Randomize');
  fireEvent.click(randomizeButton);
  expect(getByText('Randomizing...')).not.toBeNull();
  await waitFor(() => getByText('Random Wikipedia Page'));
  expect(getByText('Randomize')).not.toBeNull();
});

test('loading state is handled correctly', async () => {
  const { getByText } = render(<App />);
  const searchButton = getByText('Summarize');
  fireEvent.click(searchButton);
  expect(getByText('Summarizing...')).not.toBeNull();
  await waitFor(() => getByText('Summarize'));
  const randomizeButton = getByText('Randomize');
  fireEvent.click(randomizeButton);
  expect(getByText('Randomizing...')).not.toBeNull();
  await waitFor(() => getByText('Randomize'));
});

test('errors are handled correctly', async () => {
  const { getByText } = render(<App />);
  const searchButton = getByText('Summarize');
  fireEvent.click(searchButton);
  await waitFor(() => getByText('Failed to fetch summary. Please try again.'));
  const randomizeButton = getByText('Randomize');
  fireEvent.click(randomizeButton);
  await waitFor(() => getByText('Failed to fetch random page. Please try again.'));
});
