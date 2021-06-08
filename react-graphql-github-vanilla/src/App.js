import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { Organization } from "./Organization";

const axiosGitHubGraphhQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

const GET_ISSUES_OF_REPOSITORY = `
  query($organization: String!, $repository: String!, $cursor: String) {
    organization(login: $organization) {
      name
      url
      repository(name: $repository) {
        name
        url
        issues(first: 5, after: $cursor, states: [OPEN]) {
          edges {
            node {
              id
              title
              url
              reactions(last: 3) {
                edges {
                  node {
                    id
                    content
                  }
                }
              }
            }
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
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

  const onFetchFromGitHub = useCallback(async (path, cursor) => {
    const resolveIssuesQuery = (queryResult, cursor) => {
      const { data, errors } = queryResult.data;

      if (!cursor) {
        return { organization: data.organization, errors };
      }

      const { edges: oldIssues } = data.organization.repository.issues;
      const { edges: newIssues } = data.organization.repository.issues;
      const updatedIssues = [...oldIssues, ...newIssues];

      return {
        organization: {
          ...data.organization,
          repository: {
            ...data.organization.repository,
            issues: {
              ...data.organization.repository.issues,
              edges: updatedIssues,
            },
          },
        },
        errors,
      };
    };

    const [organization, repository] = path.split("/");

    try {
      const result = await axiosGitHubGraphhQL.post("", {
        query: GET_ISSUES_OF_REPOSITORY,
        variables: { organization, repository, cursor },
      });

      const { errors, organization: org } = resolveIssuesQuery(result, cursor);
      setOrganization(org);
      setErrors(errors);
      console.log(result);
    } catch (error) {
      setErrors(error);
      console.error(error);
    }
  }, []);

  useEffect(() => {
    onFetchFromGitHub(urlPath);
  }, [urlPath, onFetchFromGitHub]);

  const onSubmit = (e) => {
    e.preventDefault();
    setUrlPath(path);
  };

  const onChange = (e) => {
    setPath(e.target.value);
  };

  const onFetchMoreIssues = async () => {
    const { endCursor } = organization.repository.issues.pageInfo;
    console.log("path endCursor", path, endCursor);
    onFetchFromGitHub(path, endCursor);
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
        <Organization
          organization={organization}
          errors={errors}
          onFetchMoreIssues={onFetchMoreIssues}
        />
      ) : (
        <p>No information yet...</p>
      )}
    </div>
  );
}

export default App;
