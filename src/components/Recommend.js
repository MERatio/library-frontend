import React from 'react';

const Recommend = (props) => {
	const booksToRender = props.books.filter((book) =>
		book.genres.includes(props.favoriteGenre)
	);

	if (props.loading) {
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
					{booksToRender.map((book) => (
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
