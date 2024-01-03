import React, { useState } from "react";

const Header = ({ genreList, filterMovies }) => {
	// const genreList = ["All, Action, Comedy, Horror"];
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedGenres, setSelectedGenres] = useState([]);

	const nextGenre = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % genreList.length);
	};

	const prevGenre = () => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + genreList.length) % genreList.length
		);
	};

	const isAtBeginning = currentIndex === 0;
	const isAtEnd = currentIndex === 1;

	const handleClick = (genreId) => {
		setSelectedGenres((prevSelectedButtons) => {
			const updatedSelectedGenres = prevSelectedButtons.includes(genreId)
				? prevSelectedButtons.filter((id) => id !== genreId)
				: [...prevSelectedButtons, genreId];

			// Log the updated selected genres
			console.log(updatedSelectedGenres);

			// Call filterMovies with the updated selected genres
			filterMovies(updatedSelectedGenres);

			// Return the updated selected genres to be set in the state
			return updatedSelectedGenres;
		});
	};

	const handleAllClick = () => {
		setSelectedGenres([]);
		filterMovies(selectedGenres);
	};

	return (
		<div className="header">
			<div className="search-div">
				<h1>MOVIEFIX</h1>
				<form action="">
					<input
						className="search-input"
						type="text"
						name="search"
						placeholder="Search Movies..."
					/>
					<button className="search-button">Search</button>
				</form>
			</div>

			<div className="horizontal-carousel">
				<div
					className="carousel-container"
					style={{ transform: `translateX(${-currentIndex * 90}%)` }}
				>
					<button
						onClick={handleAllClick}
						className={
							selectedGenres.length === 0 ? "selected-button" : "normal-button"
						}
					>
						All
					</button>
					{genreList.map((genre) => (
						<button
							className={
								selectedGenres.includes(genre.id)
									? "selected-button"
									: "normal-button"
							}
							onClick={() => handleClick(genre.id)}
							key={genre.id}
						>
							{genre.name}
						</button>
					))}
				</div>
				<button
					onClick={prevGenre}
					className="scroll-button left"
					disabled={isAtBeginning}
				>
					{"<"}
				</button>
				<button
					onClick={nextGenre}
					className="scroll-button right"
					disabled={isAtEnd}
				>
					{">"}
				</button>
			</div>
		</div>
	);
};

export default Header;
