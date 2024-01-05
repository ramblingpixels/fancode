import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

import MovieList from "./components/MovieList";
import Header from "./components/Header";
import { GENRE_API_URL } from "./GENRE_API";

function App() {
	//store oldest and latest year in api so that user cannot scroll past that
	const latestPossibleYear = 2023;
	const oldestPossibleYear = 1910;

	//keep track of current min and max year that user sees
	const [currentMinYear, setCurrentMinYear] = useState(2012);
	const [currentMaxYear, setCurrentMaxYear] = useState(2012);

	//keep track of current newest scrolled year
	let newScrolledYear = 2012;

	//map for storing fetched movies
	const [movies, setMovies] = useState(new Map());

	//array for storing fetched genres
	const [genreList, setGenreList] = useState([]);

	//array to set genres selected by user
	const [filters, setFilters] = useState([]);

	//store searched movie name
	const [searchedMovieName, setSearchedMovieName] = useState("");

	let prevTimeOfScroll = new Date();

	//Fetching movies
	const fetchMovies = async () => {
		try {
			//fetching movies
			const response = await axios.get(
				`https://api.themoviedb.org/3/discover/movie?api_key=2dca580c2a14b55200e784d157207b4d&sort_by=popularity.desc&primary_release_year=${newScrolledYear}&vote_count.gte=100&append_to_response=credits`
			);

			//fething cast and director of movies
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

			//setting fetching movies into map
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

	//fetch movies whenever current min or max year changes
	useEffect(() => {
		newScrolledYear = currentMinYear;
		fetchMovies();
	}, [currentMinYear]);

	useEffect(() => {
		newScrolledYear = currentMaxYear;
		fetchMovies();
	}, [currentMaxYear]);

	// Function to handle scroll events
	const handleScroll = async () => {
		const scrollPosition = window.scrollY;
		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight;

		const currentTimeOfScroll = new Date();

		// Check if the user has scrolled to the bottom of the page
		if (
			scrollPosition + windowHeight >= documentHeight - 200 &&
			currentTimeOfScroll - prevTimeOfScroll > 1000
		) {
			setCurrentMaxYear((prevYear) =>
				prevYear < latestPossibleYear ? prevYear + 1 : latestPossibleYear
			);

			prevTimeOfScroll = currentTimeOfScroll;
		}

		//Checking the direction of scroll (less means going to top)
		if (scrollPosition === 0 && currentTimeOfScroll - prevTimeOfScroll > 2000) {
			setCurrentMinYear((prevYear) =>
				oldestPossibleYear < prevYear ? prevYear - 1 : oldestPossibleYear
			);

			prevTimeOfScroll = currentTimeOfScroll;
		}
	};

	//Scroll event listener
	useEffect(() => {
		// Add a scroll event listener
		window.addEventListener("wheel", handleScroll);

		// Remove the event listener when the component is unmounted
		return () => {
			window.removeEventListener("wheel", handleScroll);
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

					//check if current movie includes the term searched by user
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
				<MovieList
					movies={movies}
					genreList={genreList}
					sortedMovies={sortedMovies}
				/>
			</div>
		</div>
	);
}

export default App;
