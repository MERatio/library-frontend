import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const EditAuthor = (props) => {
	const [name, setName] = useState('');
	const [born, setBorn] = useState('');

	const [editAuthor, result] = useMutation(EDIT_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }],
		onError: (error) => {
			props.notify(error.networkError.result.errors[0].message);
		},
	});

	useEffect(() => {
		if (result.data && !result.data.editAuthor) {
			props.notify('author not found');
		}
	}, [result.data, props]);

	const submit = async (e) => {
		e.preventDefault();
		editAuthor({ variables: { name, setBornTo: parseInt(born, 10) } });
		setName('');
		setBorn('');
	};

	return (
		<form onSubmit={submit}>
			<div>
				name
				<input value={name} onChange={({ target }) => setName(target.value)} />
			</div>
			<div>
				born
				<input value={born} onChange={({ target }) => setBorn(target.value)} />
			</div>
			<button type="submit">update author</button>
		</form>
	);
};

export default EditAuthor;
