import React, { useState } from 'react';

const Books = (props) => {
  const [genre, setGenre] = useState(null);

  const getGenres = (books) => {
    let genres = [];
    books.forEach((book) => {
      genres = [...genres, ...book.genres];
    });
    return [...new Set(genres)];
  };

  const genres = getGenres(props.books);

  const booksToRender = genre
    ? props.books.filter((book) => book.genres.includes(genre))
    : props.books;

  if (!props.show) {
    return null;
  } else if (props.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>books</h2>
      {genre && (
        <div>
          in genre <b>{genre}</b>
        </div>
      )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToRender.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
