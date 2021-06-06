import React, { useEffect, useState } from "react";
import axios from "axios";

import { Organization } from "./Organization";

const axiosGitHubGraphhQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

const GET_ISSUES_OF_REPOSITORY = `
  query($organization: String!, $repository: String!) {
    organization(login: $organization) {
      name
      url
      repository(name: $repository) {
        name
        url
        issues(last: 5) {
          edges {
            node {
              id
              title
              url
            }
          }
        }
      }
    }
  }
`;

const TITLE = "React GraphQL Github Client";
const initialPath = "the-road-to-learn-react/the-road-to-learn-react";

function App() {
  const [path, setPath] = useState(initialPath);
  const [urlPath, setUrlPath] = useState(initialPath);
  const [organization, setOrganization] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    onFetchFromGitHub(urlPath);
  }, [urlPath]);

  const onSubmit = (e) => {
    e.preventDefault();
    setUrlPath(path);
  };

  const onChange = (e) => {
    setPath(e.target.value);
  };

  const onFetchFromGitHub = async (path) => {
    const [organization, repository] = path.split("/");

    try {
      const { data } = await axiosGitHubGraphhQL.post("", {
        query: GET_ISSUES_OF_REPOSITORY,
        variables: { organization, repository },
      });
      setOrganization(data.data.organization);
      setErrors(data.errors);
      console.log(data);
    } catch (error) {
      setErrors(error);
      console.error(error);
    }
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

      {organization ? (
        <Organization organization={organization} errors={errors} />
      ) : (
        <p>No information yet...</p>
      )}
    </div>
  );
}

export default App;
