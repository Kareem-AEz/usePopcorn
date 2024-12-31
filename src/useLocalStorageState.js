import { useEffect, useState } from "react";

export function useLocalStorageState(initialValue, key) {
	const [value, setValue] = useState(() => {
		try {
			const storedValue = JSON.parse(localStorage.getItem(key));
			return storedValue ? storedValue : initialValue;
		} catch (error) {
			console.error("Failed to parse localStorage value: ", error);
			return initialValue;
		}
	});

	useEffect(() => {
		try {
			if (value !== null) {
				localStorage.setItem(key, JSON.stringify(value));
			}
		} catch (error) {
			console.error("Failed to save to localStorage", error);
		}
	}, [value, key]);

	return [value, setValue];
}
