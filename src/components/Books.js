import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const Books = (props) => {
  const [books, setBooks] = useState([]);
  const [genre, setGenre] = useState(null);
  const [getBooks, allBooksResult] = useLazyQuery(ALL_BOOKS);

  useEffect(() => {
    if (props.show) {
      getBooks();
    }
  }, [props.show, getBooks]);

  useEffect(() => {
    if (allBooksResult.data) {
      setBooks(allBooksResult.data.allBooks);
    }
  }, [allBooksResult.data]);

  if (!props.show) {
    return null;
  } else if (allBooksResult.loading) {
    return <div>loading...</div>;
  }

  const getGenres = (books) => {
    let genres = [];
    books.forEach((book) => {
      genres = [...genres, ...book.genres];
    });
    return [...new Set(genres)];
  };

  const genres = getGenres(books);

  const booksToRender = genre
    ? books.filter((book) => book.genres.includes(genre))
    : books;

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
