import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

/** userEvent v14 issue reported link:
 * https://github.com/testing-library/user-event/issues/839
 *
 */

const blogId = '62dba9f463c7037a6f57c051';
const title = 'Component testing is done with react-testing-library';
const author = 'Aris';
const url = 'www.google.com';
const likes = 10;
const userAuth = {
  id: 1,
  name: 'Rick',
  username: 'Rick',
  token: 'token',
};

const blog = {
  id: blogId,
  title: title,
  url: url,
  author: author,
  likes: likes,
  user: {
    id: userAuth.id,
    name: userAuth.name,
    username: userAuth.username,
  },
};

describe('<Blog />', () => {
  const mockUpdateBlog = jest.fn();
  const mockRemoveBlog = jest.fn();
  let container;

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        user={userAuth}
        updateBlog={mockUpdateBlog}
        removeBlog={mockRemoveBlog}
      />
    ).container;
  });

  afterEach(() => {
    cleanup();
  });

  test('renders content', () => {
    const element = screen.getByText(`${blog.title} ${blog.author}`);
    expect(element).toBeDefined();
    expect(screen.queryByText(blog.likes)).toBeNull();
    expect(screen.queryByText(blog.url)).toBeNull();

    const div = container.querySelector('.blog');
    expect(div).toHaveTextContent(
      'Component testing is done with react-testing-library Aris'
    );
  });

  test('check url and number of likes are shown after clicking show button', async () => {
    const viewButton = screen.getByText('view');
    await userEvent.click(viewButton);

    const urlLabel = screen.getByText(blog.url);
    expect(urlLabel).toBeInTheDocument();
    const likesLabel = screen.getByText(`likes ${blog.likes}`);
    expect(likesLabel).toBeInTheDocument();
  });

  test('clicking the button calls event handler once', async () => {
    const viewButton = screen.getByText('view');
    let likeButton = screen.queryByText('like');
    let removeButton = screen.queryByText('remove');
    expect(likeButton).not.toBeInTheDocument();
    expect(removeButton).not.toBeInTheDocument();

    await userEvent.click(viewButton);
    //screen.debug();

    likeButton = screen.queryByText('like');
    removeButton = screen.queryByText('remove');
    const hideButton = screen.getByText('hide');
    expect(likeButton).toBeInTheDocument();
    expect(removeButton).toBeInTheDocument();
    expect(hideButton).toBeInTheDocument();

    await userEvent.click(likeButton);
    await userEvent.click(removeButton);
    expect(mockUpdateBlog).toHaveBeenCalledTimes(1);
    expect(mockRemoveBlog).toHaveBeenCalledTimes(1);
    await userEvent.click(likeButton);
    expect(mockUpdateBlog).toHaveBeenCalledTimes(2);
  });

  test('snapshot of html elements', () => {
    expect(container).toMatchSnapshot();
  });
});
