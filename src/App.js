import React, { useState, useEffect } from 'react';
import { useLazyQuery, useApolloClient } from '@apollo/client';
import { ME, ALL_BOOKS } from './queries';
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
      {page === 'add' && <NewBook notify={notify} />}
      {page === 'recommend' && (
        <Recommend
          loading={allBooksResult.loading}
          favoriteGenre={currentUser ? currentUser.favoriteGenre : null}
        />
      )}
      {page === 'login' && (
        <LoginForm notify={notify} setToken={setToken} setPage={setPage} />
      )}
    </div>
  );
};

export default App;
