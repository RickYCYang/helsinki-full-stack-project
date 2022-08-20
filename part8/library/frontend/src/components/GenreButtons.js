import React from 'react';

const genres = [
  'refactoring',
  'agile',
  'patterns',
  'design',
  'classic',
  'crime',
  'revolution',
  'all genres',
];

const GenreButtons = ({ refetch }) => {
  return genres.map((genre) => (
    <button
      key={genre}
      onClick={() => refetch({ genre: genre === 'all genres' ? null : genre })}
    >
      {genre}
    </button>
  ));
};

export default GenreButtons;
