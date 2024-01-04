import React, { useState } from "react";

const Header = ({ genreList, getSelectedGenres, getSearchedMovieName }) => {
	// const genreList = ["All, Action, Comedy, Horror"];
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedGenres, setSelectedGenres] = useState([]);
	const [input, setInput] = useState("");

	//genre carousel
	const nextGenre = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % genreList.length);
	};
	const prevGenre = () => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + genreList.length) % genreList.length
		);
	};

	//determine start and beginning of genre carousel
	const isAtBeginning = currentIndex === 0;
	const isAtEnd = currentIndex === 1;

	//user clicks one or more genres
	const handleClick = (genreId) => {
		setSelectedGenres((prevSelectedGenres) => {
			const updatedSelectedGenres = prevSelectedGenres.includes(genreId)
				? prevSelectedGenres.filter((id) => id !== genreId)
				: [...prevSelectedGenres, genreId];

			getSelectedGenres(updatedSelectedGenres);

			return updatedSelectedGenres;
		});
	};

	//user clicks All
	const handleAllClick = () => {
		setSelectedGenres(() => {
			const updatedSelectedGenres = [];
			getSelectedGenres(updatedSelectedGenres);
			return updatedSelectedGenres;
		});
	};

	//user search
	const handleChange = (event) => {
		setInput(event.target.value);
	};
	const handleSubmit = (event) => {
		event.preventDefault();
		getSearchedMovieName(input);
		setInput("");
	};

	//DOM
	return (
		<div className="header">
			<div className="search-div">
				<h1>MOVIEFIX</h1>
				<form action="" onSubmit={handleSubmit}>
					<input
						className="search-input"
						type="text"
						name="search"
						placeholder="Search Movies..."
						onChange={handleChange}
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
