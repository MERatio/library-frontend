import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK } from '../queries';

const NewBook = (props) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      const errorMessage = error.graphQLErrors[0]
        ? error.graphQLErrors[0].message
        : error.networkError.result.errors[0].message;
      props.notify(errorMessage);
    },
    update: (store, response) => {
      const booksDataInStore = store.readQuery({ query: ALL_BOOKS });
      // booksDataInStore is null if user did not visit the books view
      // therefore useLazyQuery will not be executed
      if (booksDataInStore) {
        store.writeQuery({
          query: ALL_BOOKS,
          data: {
            ...booksDataInStore,
            allBooks: [...booksDataInStore.allBooks, response.data.addBook],
          },
        });
        const authorsDataInStore = store.readQuery({ query: ALL_AUTHORS });
        store.writeQuery({
          query: ALL_AUTHORS,
          data: {
            ...authorsDataInStore,
            allAuthors: [
              ...authorsDataInStore.allAuthors,
              response.data.addBook.author,
            ],
          },
        });
      }
    },
  });

  const submit = async (e) => {
    e.preventDefault();

    createBook({
      variables: { title, author, published: parseInt(published, 10), genres },
    });

    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres([]);
    setGenre('');
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
