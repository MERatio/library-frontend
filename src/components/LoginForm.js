import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../queries';

const LoginForm = (props) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [login, result] = useMutation(LOGIN, {
		onError: (error) => {
			props.notify(error.graphQLErrors[0].message);
		},
	});

	useEffect(() => {
		if (result.data) {
			const token = result.data.login.value;
			props.setToken(token);
			localStorage.setItem('library-user-token', token);
			props.setPage('authors');
		}
	}, [result.data, props]);

	const onSubmit = async (e) => {
		e.preventDefault();
		login({ variables: { username, password } });
	};

	if (!props.show) {
		return null;
	}

	return (
		<div>
			<form onSubmit={onSubmit}>
				<div>
					username{' '}
					<input
						value={username}
						onChange={({ target }) => setUsername(target.value)}
					/>
				</div>
				<div>
					password{' '}
					<input
						type="password"
						value={password}
						onChange={({ target }) => setPassword(target.value)}
					/>
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	);
};

export default LoginForm;
