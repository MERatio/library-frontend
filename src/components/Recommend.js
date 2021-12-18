import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const Recommend = (props) => {
	const [books, setBooks] = useState([]);
	const allBooksResult = useQuery(ALL_BOOKS, {
		variables: { genre: props.favoriteGenre },
	});

	useEffect(() => {
		if (allBooksResult.data) {
			setBooks(allBooksResult.data.allBooks);
		}
	}, [allBooksResult]);

	if (allBooksResult.loading) {
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
