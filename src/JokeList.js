import React, { useState, useEffect } from "react";
import { useToggle } from "./Hooks";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

function JokeList({numJokesToGet=5}) {
  const initJokes = []
  const [jokes, setJokes] = useState(initJokes)
  const [isLoading, toggleIsLoading] = useToggle()

  /* at mount, get jokes */
  useEffect(function (){getJokes()}, [])

  /* retrieve jokes from API */
  async function getJokes() {
    try {
      // load jokes one at a time, adding not-yet-seen jokes
      let jokes = [];
      let seenJokes = new Set();

      while (jokes.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokes.push({ ...joke, votes: 0 });
        } else {
          console.log("duplicate found!");
        }
      }
      
            setJokes([...jokes])
            toggleIsLoading()
          } catch (err) {
            console.error(err);
          }
  }

  /* empty joke list, set loading state to true, and then call getJokes */
  function getNewJokes() {
    toggleIsLoading()
    getJokes()
  }

  /* change vote for this id by val (+1 or -1) */
  function vote(id,val) {
    setJokes(jokes.map(j => j.id === id ? { ...j, votes: j.votes + val } : j))
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes)

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    )
  }

  return (
    <div className="JokeList">
      <button
        className="JokeList-getmore"
        onClick={getNewJokes}
      >
        Get New Jokes
      </button>

      {sortedJokes.map(j => (
        <Joke
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={vote}
        />
      ))}
    </div>
  );
}

export default JokeList;
