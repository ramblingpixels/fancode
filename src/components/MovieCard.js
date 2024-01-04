import React from "react";

const MovieCard = ({ movies, genreList, filters, searchedMovieName }) => {
	let sortedMovies = [];

	let currentYear = null;

	//filter movies
	for (let i = 2023; i >= 1900; i--) {
		if (movies.has(i)) {
			const currentYearMovies = movies.get(i);

			// if not all
			if (filters.length !== 0 || searchedMovieName.trim() !== 0) {
				const uniqueMovieIds = new Set();
				const filteredMovies = currentYearMovies.filter((currentYearMovie) => {
					// Check if all selected genres are present in the movie
					const hasSelectedGenres = filters.every((genreId) =>
						currentYearMovie.genre_ids.includes(genreId)
					);

					const hasSearchedMovieName =
						searchedMovieName.trim() === "" ||
						currentYearMovie.title
							.toLowerCase()
							.includes(searchedMovieName.toLowerCase());

					// If the movie has selected genres and has been searched for and hasn't been added before
					if (
						hasSelectedGenres &&
						hasSearchedMovieName &&
						!uniqueMovieIds.has(currentYearMovie.id)
					) {
						uniqueMovieIds.add(currentYearMovie.id);
						return true;
					}
					return false;
				});

				sortedMovies = [...filteredMovies, ...sortedMovies];
				console.log(sortedMovies);
			} else {
				sortedMovies = [...currentYearMovies, ...sortedMovies];
			}
		}
	}

	return (
		<>
			{sortedMovies.map((movie) => {
				const releaseYear = new Date(movie.release_date).getFullYear();

				const yearHeader =
					releaseYear !== currentYear ? (
						<h1 key={releaseYear} className="year-header">
							{releaseYear}
						</h1>
					) : null;

				currentYear = releaseYear;

				return (
					<>
						{yearHeader}
						<div key={movie.id} className="movie-card">
							<li>
								<h4>{movie.title}</h4>
							</li>
							<img
								src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
								alt=""
							/>
							<div className="movie-details">
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
							</div>
						</div>
					</>
				);
			})}
		</>
	);
};

export default MovieCard;
