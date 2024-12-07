
import React, { createContext, useState, useEffect } from 'react';

export const TVGenreContext = createContext();

export function TVGenreProvider({ children }) {
    const [genreForTV, setGenreForTV] = useState("")
 

    const apiKey = '814d8d230ad1294ccbdbb69cccb0bc29'; 
    // const url = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}`;
    // const url1 = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&page=1&sort_by=popularity.desc`
    const authorization = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTRkOGQyMzBhZDEyOTRjY2JkYmI2OWNjY2IwYmMyOSIsIm5iZiI6MTczMTQwMTUxNC4zNzIzMjk1LCJzdWIiOiI2NzMzMTViNjI5YWE4ZmYyNDRjMGUzODEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0qof6UxtmX1ZydXb7hPBwnROQT3zdyKAbEXhXQ0OO4A';
    const urlForTVGenre = `https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=en-US`;

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: authorization,
            },
        };

        fetch(urlForTVGenre, options)
            .then((req) => req.json()) // Parse the JSON data
            .then((res) => {
                setGenreForTV(res.genres); // Use res.results for movie 
                console.log(`This is genres: ${JSON.stringify(res.genres)}`);
            })
            .catch((err) => {
                console.error('Error fetching data:', err); // Handle errors
            });
    }, []);

    return (
        <TVGenreContext.Provider value={genreForTV}>
          {children}
        </TVGenreContext.Provider>
      );
    }