import { useEffect, useState } from "react";
import "./App.css";
import axios, { all } from "axios";

import MovieCard from "./components/MovieCard";
import Header from "./components/Header";
import { GENRE_API_URL } from "./API";

function App() {
	const maxYear = 2023;
	const [movies, setMovies] = useState(new Map());
	const [genreList, setGenreList] = useState([]);
	const [currentYear, setCurrentYear] = useState(2012);
	const [page, setPage] = useState(1);

	//Fetching movies
	const fetchMovies = async () => {
		try {
			const response = await axios.get(
				`https://api.themoviedb.org/3/discover/movie?api_key=2dca580c2a14b55200e784d157207b4d&sort_by=popularity.desc&primary_release_year=${currentYear}&page=1&vote_count.gte=100&append_to_response=credits`
			);
			setMovies(
				(map) => new Map(map.set(currentYear, [...response.data.results]))
			);
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
			setCurrentYear((prevYear) =>
				prevYear < maxYear ? prevYear + 1 : maxYear
			);
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
		console.log(selectedGenres);
		console.log(selectedGenres.length);

		//get movies array from mapping
		let allMovies = [];
		for (let i = 2023; i >= 1900; i--) {
			if (movies.has(i)) {
				const currentYearMovies = movies.get(i);
				allMovies = [...currentYearMovies, ...allMovies];
			}
		}

		//filter movies based on genre
		if (selectedGenres.length !== 0) {
			const uniqueMovieIds = new Set();

			const filteredMovies = allMovies.filter((allMovie) => {
				// Check if all selected genres are present in the movie
				const hasSelectedGenres = selectedGenres.every((genreId) =>
					allMovie.genre_ids.includes(genreId)
				);

				// If the movie has selected genres and hasn't been added before
				if (hasSelectedGenres && !uniqueMovieIds.has(allMovie.id)) {
					uniqueMovieIds.add(allMovie.id);
					return true;
				}
				return false;
			});
			console.log(filteredMovies);
			setMovies((map) => new Map(map.set(currentYear, [...filteredMovies])));
		} else {
			console.log(allMovies);

			setMovies((map) => new Map(map.set(currentYear, [...allMovies])));
		}
	};

	return (
		<div className="App">
			<Header genreList={genreList} filterMovies={filterMovies} />
			<div id="movieContainer" className="movie-list">
				<MovieCard
					currentYear={currentYear}
					movies={movies}
					genreList={genreList}
				/>
			</div>
		</div>
	);
}

export default App;
