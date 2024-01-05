import React from "react";

const MovieList = ({ genreList, sortedMovies }) => {
	let currentYear = null;

	//displaying list of all the movies

	return (
		<>
			{sortedMovies.map((movie) => {
				//dispalying year only when year changes
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
							<img
								src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
								alt=""
								className="movie-poster"
							/>
							<div className="movie-details">
								<h4>{movie.title}</h4>
								<p>
									<b>Genres:</b>{" "}
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
									<b>Overview:</b>{" "}
									{movie.overview
										? `${movie.overview
												.split(" ")
												.slice(0, 15)
												.join(" ")
												.replace(/<.+?>/g, "")}...`
										: "No description"}
								</p>
								<p>
									<b>Cast:</b> {movie.cast.flat().join(", ")}
								</p>
								<p>
									<b>Director:</b> {movie.director}
								</p>
							</div>
						</div>
					</>
				);
			})}
		</>
	);
};

export default MovieList;
