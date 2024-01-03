import React from "react";

const MovieCard = ({ currentYear, movies, genreList }) => {
	console.log(movies);
	// A list of all movies sorted for display
	let sortedMovies = [];
	for (let i = 2023; i >= 1900; i--) {
		if (movies.has(i)) {
			const currentYearMovies = movies.get(i);
			sortedMovies = [...currentYearMovies, ...sortedMovies];
		}
	}

	return (
		<>
			{sortedMovies.map((movie) => (
				<div key={movie.id} className="movie-card">
					<li>
						<h4>{movie.title}</h4>
					</li>
					<img
						src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
						alt=""
					/>
					<div className="movie-details">
						<p>{`Release Year: ${movie.release_date.slice(0, 4)}`}</p>
						<p>
							Genres:{" "}
							{genreList
								.map((genre) =>
									movie.genre_ids.map((movieGenreId) =>
										genre.id === movieGenreId ? genre.name : null
									)
								)
								.flat()
								.filter(Boolean)
								.join(", ")}
						</p>
						<p>
							Overview:{" "}
							{movie.overview
								? `${movie.overview
										.split(" ")
										.slice(0, 15)
										.join(" ")
										.replace(/<.+?>/g, "")}...`
								: "No description"}
						</p>
						<p>{movie.popularity}</p>
					</div>
				</div>
			))}
		</>
	);
};

export default MovieCard;
