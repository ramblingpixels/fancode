import React from "react";

const MovieCard = ({ currentYear, movies }) => {
	return (
		<>
			{movies.map((movie) => (
				<div key={movie.id} className="movie-card">
					<li>
						<h4>{movie.title}</h4>
					</li>
					<img
						src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
						alt=""
					/>
				</div>
			))}
		</>
	);
};

export default MovieCard;
