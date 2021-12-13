import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const Books = (props) => {
  const [books, setBooks] = useState([]);
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

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
