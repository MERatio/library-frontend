import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { ALL_AUTHORS } from '../queries';

const Authors = (props) => {
  const [authors, setAuthors] = useState([]);
  const [getAuthors, allAuthorsResult] = useLazyQuery(ALL_AUTHORS);

  useEffect(() => {
    if (props.show) {
      getAuthors();
    }
  }, [props.show, getAuthors]);

  useEffect(() => {
    if (allAuthorsResult.data) {
      setAuthors(allAuthorsResult.data.allAuthors);
    }
  }, [allAuthorsResult.data]);

  if (!props.show) {
    return null;
  } else if (allAuthorsResult.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((author) => (
            <tr key={author.name}>
              <td>{author.name}</td>
              <td>{author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Authors;
