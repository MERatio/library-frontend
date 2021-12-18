import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery, useApolloClient } from '@apollo/client';
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
  const meResult = useQuery(ME);
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
    localStorage.removeItem('library-user-token');
    client.resetStore();
    const authRequiredPages = ['add', 'recommend'];
    if (authRequiredPages.includes(page)) {
      setPage('authors');
    }
  };

  useEffect(() => {
    if (meResult.loading) {
      return;
    } else {
      setCurrentUser(meResult.data.me);
    }
  }, [meResult]);

  useEffect(() => {
    if (['books', 'recommend'].includes(page)) {
      getBooks();
    }
  }, [page, getBooks]);

  useEffect(() => {
    if (allBooksResult.data) {
      setBooks(allBooksResult.data.allBooks);
    }
  }, [allBooksResult.data]);

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && (
          <button onClick={() => setPage('recommend')}>recommend</button>
        )}
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={handleLogoutBtnClick}>logout</button>}
      </div>
      <Authors show={page === 'authors'} notify={notify} token={token} />
      <Books
        show={page === 'books'}
        loading={allBooksResult.loading}
        books={books}
      />
      <NewBook show={page === 'add'} notify={notify} />
      <Recommend
        show={page === 'recommend'}
        loading={allBooksResult.loading}
        books={books}
        favoriteGenre={currentUser ? currentUser.favoriteGenre : null}
      />
      {!token && (
        <LoginForm
          show={page === 'login'}
          notify={notify}
          setToken={setToken}
          setPage={setPage}
        />
      )}
    </div>
  );
};

export default App;
