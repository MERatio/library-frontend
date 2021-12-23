import React, { useState, useEffect } from 'react';
import { useLazyQuery, useApolloClient, useSubscription } from '@apollo/client';
import { ME, ALL_BOOKS, ALL_AUTHORS, BOOK_ADDED } from './queries';
import Notify from './components/Notify';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Recommend from './components/Recommend';
import LoginForm from './components/LoginForm';

const App = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [getMe, meResult] = useLazyQuery(ME);
  const [getBooks, allBooksResult] = useLazyQuery(ALL_BOOKS);

  const client = useApolloClient();

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const handleLogoutBtnClick = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('library-user-token');
    client.resetStore();
    const authRequiredPages = ['add', 'recommend'];
    if (authRequiredPages.includes(page)) {
      setPage('authors');
    }
  };

  const updateCacheWithBook = (book) => {
    const booksDataInStore = client.readQuery({ query: ALL_BOOKS });
    // booksDataInStore is null if user did not visit the books view
    // therefore useLazyQuery will not be executed
    if (booksDataInStore) {
      const booksId = booksDataInStore.allBooks.map((book) => book.id);
      if (!booksId.includes(book.id)) {
        client.writeQuery({
          query: ALL_BOOKS,
          data: {
            ...booksDataInStore,
            allBooks: [...booksDataInStore.allBooks, book],
          },
        });
      }
    }
    const authorsDataInStore = client.readQuery({ query: ALL_AUTHORS });
    const authorsNames = authorsDataInStore.allAuthors.map(
      (author) => author.name
    );
    if (!authorsNames.includes(book.author.name)) {
      client.writeQuery({
        query: ALL_AUTHORS,
        data: {
          ...authorsDataInStore,
          allAuthors: [...authorsDataInStore.allAuthors, book.author],
        },
      });
    }
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const book = subscriptionData.data.bookAdded;
      window.alert(`New book ${book.title} added`);
      updateCacheWithBook(book);
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('library-user-token');
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getMe();
    }
  }, [token, getMe]);

  useEffect(() => {
    if (meResult.data) {
      setCurrentUser(meResult.data.me);
    }
  }, [meResult]);

  useEffect(() => {
    if (['books'].includes(page)) {
      getBooks();
    }
  }, [page, getBooks]);

  useEffect(() => {
    if (allBooksResult.data) {
      setBooks(allBooksResult.data.allBooks);
    }
  }, [allBooksResult.data]);

  if (meResult.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {currentUser && (
          <button onClick={() => setPage('add')}>add book</button>
        )}
        {currentUser && (
          <button onClick={() => setPage('recommend')}>recommend</button>
        )}
        {!currentUser && (
          <button onClick={() => setPage('login')}>login</button>
        )}
        {currentUser && <button onClick={handleLogoutBtnClick}>logout</button>}
      </div>
      {page === 'authors' && (
        <Authors notify={notify} currentUser={currentUser} />
      )}
      <Books
        show={page === 'books'}
        loading={allBooksResult.loading}
        books={books}
      />
      {page === 'add' && (
        <NewBook notify={notify} updateCacheWithBook={updateCacheWithBook} />
      )}
      <Recommend
        show={page === 'recommend'}
        loading={allBooksResult.loading}
        favoriteGenre={currentUser ? currentUser.favoriteGenre : null}
      />
      {page === 'login' && (
        <LoginForm notify={notify} setToken={setToken} setPage={setPage} />
      )}
    </div>
  );
};

export default App;
