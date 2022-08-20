import React from 'react';

const Recommendations = ({ books, show }) => {
  if (!show) {
    return null;
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre patterns</p>
      <table>
        <tbody style={{ textAlign: 'left' }}>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
