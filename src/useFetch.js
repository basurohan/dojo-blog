import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  // Fires function on every render
  // Becareful of changing state inside useEffect, that can put
  // rendering of the page in an infinite loop
  // use dependency array to define when the function should run
  // [] array will only run once when page is loaded
  useEffect(() => {
    const abortCont = new AbortController();

    setTimeout(() => {
      fetch(url, { signal: abortCont.signal })
        .then((res) => {
          if (!res.ok) {
            throw Error("could not fetch data");
          }
          return res.json();
        })
        .then((data) => {
          setData(data);
          setIsPending(false);
          setError(null);
        })
        .catch((err) => {
          if (err.name === "AbortError") {
            console.log("Fetch aborted");
          } else {
            setIsPending(false);
            setError(err.message); 
          }
        });
    }, 100);

    return () => abortCont.abort();

  }, [url]);

  return { data, isPending, error }

};

export default useFetch;
