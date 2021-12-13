import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Select from 'react-select';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const EditAuthor = (props) => {
	const [selectedName, setSelectedName] = useState(null);
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
		const name = selectedName ? selectedName.value : '';
		editAuthor({
			variables: { name, setBornTo: parseInt(born, 10) },
		});
		setBorn('');
	};

	const namesOptions = props.authors.map((author) => ({
		value: author.name,
		label: author.name,
	}));

	return (
		<form onSubmit={submit}>
			<Select
				onChange={setSelectedName}
				options={namesOptions}
				placeholder="Select an author..."
			/>
			<div>
				born
				<input value={born} onChange={({ target }) => setBorn(target.value)} />
			</div>
			<button type="submit">update author</button>
		</form>
	);
};

export default EditAuthor;
