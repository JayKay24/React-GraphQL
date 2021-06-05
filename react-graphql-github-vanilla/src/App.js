import React, { useEffect, useState } from "react";
import axios from "axios";

const axiosGitHubGraphhQL = axios.create({
  baseURL: "https://api/github.com/graphql",
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

const TITLE = "React GraphQL Github Client";

function App() {
  const [path, setPath] = useState(
    "the-road-to-learn-react/the-road-to-learn-react"
  );

  const onSubmit = (e) => {
    e.preventDefault();
  };

  const onChange = (e) => {
    setPath(e.target.value);
  };

  return (
    <div>
      <h1>{TITLE}</h1>

      <form onSubmit={onSubmit}>
        <label htmlFor="url">Show open issues for https://github.com/</label>
        <input
          id="url"
          type="text"
          onChange={onChange}
          style={{ width: "300px" }}
          value={path}
        />
        <button type="submit">Search</button>
      </form>
      <hr />

      {/** Here comes the result! */}
    </div>
  );
}

export default App;
