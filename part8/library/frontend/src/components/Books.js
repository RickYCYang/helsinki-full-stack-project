import React from 'react';
import GenreButtons from './GenreButtons';

const Books = ({ books, show, refetch, setError }) => {
  if (!show) {
    return null;
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody style={{ textAlign: 'left' }}>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
            <th>Genres</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
              <td>{book.genres.join(',')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <GenreButtons refetch={refetch} />
    </div>
  );
};

export default Books;
