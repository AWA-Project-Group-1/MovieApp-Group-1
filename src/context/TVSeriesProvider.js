import React, { createContext, useState, useEffect } from 'react';

export const TVSeriesContext = createContext();

export function TVSeriesProvider({ children }) {
  // const [tvSeiresCards, setTVSeires] = useState([]);
  const authorization = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTRkOGQyMzBhZDEyOTRjY2JkYmI2OWNjY2IwYmMyOSIsIm5iZiI6MTczMTQwMTUxNC4zNzIzMjk1LCJzdWIiOiI2NzMzMTViNjI5YWE4ZmYyNDRjMGUzODEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0qof6UxtmX1ZydXb7hPBwnROQT3zdyKAbEXhXQ0OO4A';
  const apiKey = '814d8d230ad1294ccbdbb69cccb0bc29';
  const [tvSeriesData, setTvSeriesData] = useState([]);
  const url1 = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&page=1&sort_by=popularity.desc`
  const url2 = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&page=2&sort_by=popularity.desc`
  const url3 = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&page=3&sort_by=popularity.desc`
  const url4 = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&page=3&sort_by=popularity.desc`
 

  const urls = [url1, url2, url3, url4];

  useEffect(() => {
    const fetchData = async () => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: authorization,
            },
        };

        let allResults = []; // Array to hold all the results

        // Loop through each URL and fetch data sequentially
        for (let url of urls) {
            try {
                const response = await fetch(url, options); // Wait for the response
                const data = await response.json(); // Parse the JSON data
                allResults = [...allResults, ...data.results]; // Combine the results
            } catch (err) {
                console.error('Error fetching data:', err); // Handle errors
            }
        }

        // After all requests, update the state with combined results
        setTvSeriesData(allResults);
        
        console.log('This is tvSeriesData:', JSON.stringify(allResults, null, 2)); 
    };

    fetchData(); // Call the fetchData function
}, []); // eslint-disable-line react-hooks/exhaustive-deps



  return (
    <TVSeriesContext.Provider value={tvSeriesData}>
      {children}
    </TVSeriesContext.Provider>
  );
}