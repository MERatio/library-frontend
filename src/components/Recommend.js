import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const Recommend = (props) => {
	const [books, setBooks] = useState([]);
	const [getBooks, allBooksResult] = useLazyQuery(ALL_BOOKS);

	useEffect(() => {
		if (props.show) {
			getBooks({ variables: { genre: props.favoriteGenre } });
		}
	}, [getBooks, props.show, props.favoriteGenre]);

	useEffect(() => {
		if (allBooksResult.data) {
			setBooks(allBooksResult.data.allBooks);
		}
	}, [allBooksResult.data]);

	if (!props.show) {
		return null;
	} else if (allBooksResult.loading) {
		return <div>loading...</div>;
	}

	return (
		<div>
			<h2>recommendations</h2>
			<div>
				books in your favorite genre <b>{props.favoriteGenre}</b>
			</div>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{books.map((book) => (
						<tr key={book.title}>
							<td>{book.title}</td>
							<td>{book.author.name}</td>
							<td>{book.published}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Recommend;
