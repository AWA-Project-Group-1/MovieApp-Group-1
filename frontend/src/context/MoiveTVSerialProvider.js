import React, { createContext, useState, useEffect } from 'react';

export const MoiveTVSerialContext = createContext();

export function MoiveTVSerialProvider({ children }) {

    // const [tvSeiresCards, setTVSeires] = useState([]);
    const authorization = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTRkOGQyMzBhZDEyOTRjY2JkYmI2OWNjY2IwYmMyOSIsIm5iZiI6MTczMTQwMTUxNC4zNzIzMjk1LCJzdWIiOiI2NzMzMTViNjI5YWE4ZmYyNDRjMGUzODEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0qof6UxtmX1ZydXb7hPBwnROQT3zdyKAbEXhXQ0OO4A';
    const apiKey = process.env.REACT_APP_TMDB_API_KEY;
    const [movieTVSerialData, setMovieTVSerialData] = useState({ tvSeries: [], movies: [] });
    const url11 = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&page=1&sort_by=popularity.desc`
    const url12 = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&page=2&sort_by=popularity.desc`
    const url13 = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&page=3&sort_by=popularity.desc`
    const url14 = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&page=4&sort_by=popularity.desc`

    const url21 = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`
    const url22 = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=2&sort_by=popularity.desc`
    const url23 = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=3&sort_by=popularity.desc`
    const url24 = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=4&sort_by=popularity.desc`

    const urlsfortvseries = [url11, url12, url13, url14];
    const urlsformovies = [url21, url22, url23, url24];


    useEffect(() => {
        const fetchData = async () => {
            let tvSeriesData = [];
            let movieData = [];
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: authorization,
                },
            };

            // Fetch TV series
            for (const url of urlsfortvseries) {
                try {
                    const data = await fetch(url, options).then((res) => res.json());
                    tvSeriesData = [...tvSeriesData, ...data.results];

                } catch (error) {
                    console.error("TV series error:", error);
                }

            }

            // to fetch movies

            for (const url of urlsformovies) {
                try {
                    const data = await fetch(url, options).then((res) => res.json());
                    movieData = [...movieData, ...data.results];

                } catch (error) {
                    console.error("Movie error:", error);
                }

            }

            setMovieTVSerialData({ tvSeries: tvSeriesData, movies: movieData });

        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log(`This is movieTVSerialData: ${JSON.stringify(movieTVSerialData)}`);
    }, [movieTVSerialData]);

    return (
        <MoiveTVSerialContext.Provider value={movieTVSerialData}>
            {children}
        </MoiveTVSerialContext.Provider>
    );
}