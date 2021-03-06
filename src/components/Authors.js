import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_AUTHORS } from '../queries';
import EditAuthor from './EditAuthor';

const Authors = (props) => {
  const [authors, setAuthors] = useState([]);
  const allAuthorsResult = useQuery(ALL_AUTHORS);

  useEffect(() => {
    if (allAuthorsResult.data) {
      setAuthors(allAuthorsResult.data.allAuthors);
    }
  }, [allAuthorsResult]);

  if (allAuthorsResult.loading) {
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
      {props.currentUser && (
        <div>
          <h2>Set birthyear</h2>
          <EditAuthor authors={authors} notify={props.notify} />
        </div>
      )}
    </div>
  );
};

export default Authors;
