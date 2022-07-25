import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BlogForm from './BlogForm';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

describe('<BlogForm /> updates parent state and calls onSubmit', () => {
  const createBlog = jest.fn();
  let container;
  beforeEach(() => {
    container = render(<BlogForm createBlog={createBlog} />).container;
  });
  afterEach(() => {
    cleanup();
  });
  test('updates parent state and calls onSubmit', async () => {
    //let [titleInput, authorInput, urlInput] = screen.getAllByRole('textbox');
    const titleInput = screen.getByPlaceholderText('write here blog title');
    const authorInput = screen.getByPlaceholderText('write here blog author');
    const urlInput = screen.getByPlaceholderText('write here blog url');
    const sendButton = screen.getByText('create');

    const title = 'Hello World';
    const author = 'Rick';
    const url = 'www.google.com';

    await act(async () => {
      await userEvent.type(titleInput, title);
      expect(titleInput.value).toBe(title);
      await userEvent.type(authorInput, author);
      expect(authorInput.value).toBe(author);
      await userEvent.type(urlInput, url);
      expect(urlInput.value).toBe(url);
      await userEvent.click(sendButton);
    });

    expect(createBlog).toHaveBeenCalledTimes(1);
    expect(createBlog.mock.calls[0][0].title).toBe(title);
    expect(createBlog.mock.calls[0][0].author).toBe(author);
    expect(createBlog.mock.calls[0][0].url).toBe(url);
    expect(titleInput.value).toBe('');
    expect(authorInput.value).toBe('');
    expect(urlInput.value).toBe('');
  });

  test('snapshot of html elements', () => {
    expect(container).toMatchSnapshot();
  });
});
