const _ = require('lodash');

/** exercise 4.3 */
const dummy = (blogs) => {
  return 1;
};

/** exercise 4.4 */
const totalLikes = (blogs) => {
  const ttlLike = blogs.reduce((prevTotalLike, blog) => {
    return prevTotalLike + blog.likes;
  }, 0);
  return ttlLike;
};

/** exercise 4.5 */
const favoriteBlog = (blogs) => {
  const maxLikeBlog = blogs.reduce((prevBlog, currBlog) => {
    if (currBlog.likes > (prevBlog.likes || Number.MIN_SAFE_INTEGER))
      return currBlog;
    else return prevBlog;
  }, {});
  return maxLikeBlog;
};

/** exercise 4.6 */
const mostBlogs = (blogs) => {
  const blogCntOfAuthors = _.countBy(blogs, 'author');
  const mostBlogAuthor = Object.entries(blogCntOfAuthors).reduce(
    (prevAuthor, [author, blogs]) => {
      if (blogs > (prevAuthor.blogs || Number.MIN_SAFE_INTEGER))
        return { author, blogs };
      else return prevAuthor;
    },
    {}
  );
  return mostBlogAuthor;
};

/** exercise 4.7 */
const mostLikes = (blogs) => {
  const blogOfAuthors = _.groupBy(blogs, 'author');
  const ttlLikesOfAuthors = Object.entries(blogOfAuthors).map(
    ([author, blogs]) => {
      const ttlLikes = blogs.reduce((prevTTlLikes, currBlog) => {
        return prevTTlLikes + currBlog.likes;
      }, 0);
      return { author, likes: ttlLikes };
    }
  );
  const mostLikesAuthor = ttlLikesOfAuthors.reduce((prevAuthor, currAuthor) => {
    if (currAuthor.likes > (prevAuthor.likes || Number.MIN_SAFE_INTEGER))
      return currAuthor;
    else return prevAuthor;
  }, {});
  return mostLikesAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
