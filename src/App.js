import React, { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import Notify from './components/Notify';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';

const App = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState('');
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
  };

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={handleLogoutBtnClick}>logout</button>}
      </div>
      <Authors show={page === 'authors'} notify={notify} token={token} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} notify={notify} />
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
