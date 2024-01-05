import { useEffect, useState } from "react";
import "./App.css";
import axios, { all } from "axios";

import MovieCard from "./components/MovieCard";
import Header from "./components/Header";
import { GENRE_API_URL } from "./API";

function App() {
	//
	const latestYear = 2023;
	const oldestYear = 1910;

	//
	const [currentMinYear, setCurrentMinYear] = useState(2012);
	const [currentMaxYear, setCurrentMaxYear] = useState(2012);

	//
	let newScrolledYear = 2012;

	//
	const [movies, setMovies] = useState(new Map());

	//
	const [genreList, setGenreList] = useState([]);

	//
	const [filters, setFilters] = useState([]);

	//
	const [page, setPage] = useState(1);

	//
	const [searchedMovieName, setSearchedMovieName] = useState("");

	//Fetching movies
	const fetchMovies = async () => {
		try {
			const response = await axios.get(
				`https://api.themoviedb.org/3/discover/movie?api_key=2dca580c2a14b55200e784d157207b4d&sort_by=popularity.desc&primary_release_year=${newScrolledYear}&page=1&vote_count.gte=100&append_to_response=credits`
			);

			for (const movie of response.data.results) {
				const castResponse = await axios.get(
					`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=2dca580c2a14b55200e784d157207b4d`
				);
				const director = castResponse.data.crew.filter(
					(castMember) => castMember.job === "Director"
				)[0].name;
				const cast = castResponse.data.cast
					.slice(0, 2)
					.map((castMember) => castMember.name);
				movie.director = director;
				movie.cast = cast;
			}

			setMovies(
				(map) => new Map(map.set(newScrolledYear, [...response.data.results]))
			);
		} catch (error) {
			console.error("Error fetching movies:", error);
		}
	};

	//Fetching genres
	useEffect(() => {
		axios
			.get(GENRE_API_URL)
			.then((res) => {
				setGenreList(res.data.genres);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	useEffect(() => {
		newScrolledYear = currentMinYear;
		fetchMovies();
	}, [currentMinYear]);

	useEffect(() => {
		newScrolledYear = currentMaxYear;
		fetchMovies();
	}, [currentMaxYear]);

	// Function to handle scroll events
	const handleScroll = () => {
		const scrollPosition = window.scrollY;
		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight;

		// Check if the user has scrolled to the bottom of the page
		if (scrollPosition + windowHeight >= documentHeight - 100) {
			setCurrentMaxYear((prevYear) =>
				prevYear < latestYear ? prevYear + 1 : latestYear
			);
			setPage(1);
		}

		// Check if the user has scrolled to the top of the page
		if (scrollPosition === 0) {
			setCurrentMinYear((prevYear) =>
				oldestYear < prevYear ? prevYear - 1 : oldestYear
			);
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

	// selected genres list
	const getSelectedGenres = (selectedGenres) => {
		setFilters(selectedGenres);
	};

	//get searched movie name
	const getSearchedMovieName = (input) => {
		setSearchedMovieName(input);
	};

	let sortedMovies = [];

	//filter movies based on selected genre(s) and user search
	for (let i = 2023; i >= 1900; i--) {
		if (movies.has(i)) {
			const currentYearMovies = movies.get(i);

			// if not all
			if (filters.length !== 0 || searchedMovieName.trim() !== 0) {
				const uniqueMovieIds = new Set();
				const filteredMovies = currentYearMovies.filter((currentYearMovie) => {
					//check if all selected genres are present in the movie
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
			} else {
				sortedMovies = [...currentYearMovies, ...sortedMovies];
			}
		}
	}

	return (
		<div className="App">
			<Header
				genreList={genreList}
				getSelectedGenres={getSelectedGenres}
				getSearchedMovieName={getSearchedMovieName}
			/>
			<div id="movieContainer" className="movie-list">
				<MovieCard
					movies={movies}
					genreList={genreList}
					sortedMovies={sortedMovies}
				/>
			</div>
		</div>
	);
}

export default App;
