import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

import MovieCard from "./components/MovieCard";
import Header from "./components/Header";
import { GENRE_API_URL } from "./API";

function App() {
	const [movies, setMovies] = useState([]);
	const [genreList, setGenreList] = useState([]);
	const [currentYear, setCurrentYear] = useState(2012);
	const [page, setPage] = useState(1);

	//Fetching movies
	const fetchMovies = async () => {
		try {
			const response = await axios.get(
				`https://api.themoviedb.org/3/discover/movie?api_key=2dca580c2a14b55200e784d157207b4d&sort_by=popularity.desc&primary_release_year=${currentYear}&page=1&vote_count.gte=100&with_cast`
			);

			if (window.scrollY === 0) {
				setMovies((prevMovies) => [...response.data.results, ...prevMovies]);
			} else {
				// Otherwise, add movies at the end of the array
				setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
			}
		} catch (error) {
			console.error("Error fetching movies:", error);
		}

		console.log(currentYear);
	};

	//Fetching genres
	useEffect(() => {
		axios
			.get(GENRE_API_URL)
			.then((res) => {
				console.log(res.data.genres);
				setGenreList(res.data.genres);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	useEffect(() => {
		fetchMovies();
	}, [currentYear]); // Fetch movies when the year changes

	// Function to handle scroll events
	const handleScroll = () => {
		const scrollPosition = window.scrollY;
		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight;

		// Check if the user has scrolled to the bottom of the page
		if (scrollPosition + windowHeight >= documentHeight - 100) {
			setCurrentYear((prevYear) => prevYear + 1);
			setPage(1);
		}

		// Check if the user has scrolled to the top of the page
		if (scrollPosition === 0) {
			setCurrentYear((prevYear) => prevYear - 1);
			setPage(1);
		}
	};

	//Scroll event listener
	useEffect(() => {
		// Add a scroll event listener
		window.addEventListener("scroll", handleScroll);

		// Remove the event listener when the component is unmounted
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// Filter movies based on genre
	const filterMovies = (selectedGenres) => {
		// console.log(selectedGenres);
		// const filteredMovies = {
		//   movies.map((movie) => {
		// })}
	};

	return (
		<div className="App">
			<Header genreList={genreList} filterMovies={filterMovies} />
			<div id="movieContainer" className="movie-list">
				<MovieCard currentYear={currentYear} movies={movies} />
			</div>
		</div>
	);
}

export default App;
