import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import App from './App';

jest.mock('axios');

test('handleSearch function - successful API call', async () => {
  const mockResponse = {
    data: {
      results: ['Page 1', 'Page 2', 'Page 3']
    }
  };
  axios.get.mockResolvedValue(mockResponse);

  render(<App />);
  fireEvent.change(screen.getByPlaceholderText('Enter Wikipedia page name'), { target: { value: 'Page' } });
  await waitFor(() => expect(screen.getByText('Page 1')).toBeInTheDocument());
});

test('handleSearch function - failed API call', async () => {
  axios.get.mockRejectedValue(new Error('Failed to fetch'));

  render(<App />);
  fireEvent.change(screen.getByPlaceholderText('Enter Wikipedia page name'), { target: { value: 'Page' } });
  await waitFor(() => expect(screen.getByText('Failed to search. Please try again.')).toBeInTheDocument());
});

test('randomizePage function - successful API call', async () => {
  const mockResponse = {
    data: {
      pageName: 'Random Page',
      summary: 'This is a random page.'
    }
  };
  axios.get.mockResolvedValue(mockResponse);

  render(<App />);
  fireEvent.click(screen.getByText('Randomize'));
  await waitFor(() => expect(screen.getByText('Random Page')).toBeInTheDocument());
});

test('randomizePage function - failed API call', async () => {
  axios.get.mockRejectedValue(new Error('Failed to fetch'));

  render(<App />);
  fireEvent.click(screen.getByText('Randomize'));
  await waitFor(() => expect(screen.getByText('Failed to fetch random page. Please try again.')).toBeInTheDocument());
});
