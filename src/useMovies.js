import { useState, useEffect } from "react";
const API_KEY = "b1330894";

export function useMovies(query) {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const controller = new AbortController();

		async function fetchMovies() {
			try {
				setIsLoading(true);
				setError("");
				const res = await fetch(
					`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
					{ signal: controller.signal }
				);
				if (!res.ok)
					throw new Error(`Something went wrong fetching movies ${res.status}`);
				const data = await res.json();

				if (data.Response === "False")
					throw new Error(`Movie not found for query "${query}"!`);

				setMovies(data.Search);
				setError("");
			} catch (error) {
				if (error.name !== "AbortError") {
					console.error(error);
					setError(error.message);
				}
			} finally {
				setIsLoading(false);
			}
		}

		if (query.length < 3) {
			setError("");
			setMovies([]);
			return;
		}

		fetchMovies();

		return () => controller.abort();
	}, [query]);

	return { movies, isLoading, error };
}
