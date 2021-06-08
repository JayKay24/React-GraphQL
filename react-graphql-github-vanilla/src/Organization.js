import React from "react";

const ReactionsItem = ({ reaction }) => <li>{reaction.node.content}</li>;

const ReactionsList = ({ reactions }) => (
  <ul>
    {reactions.edges.map((reaction, idx) => (
      <ReactionsItem key={reaction.node.id} reaction={reaction} />
    ))}
  </ul>
);

const Repository = ({ repository, onFetchMoreIssues }) => (
  <div>
    <p>
      <strong>In Repository:&nbsp;</strong>
      <a href={repository.url}>{repository.name}</a>
    </p>

    <ul>
      {repository.issues.edges.map((issue) => (
        <li key={issue.node.id}>
          <a href={issue.node.url}>{issue.node.title}</a>

          <ul>
            <ReactionsList reactions={issue.node.reactions} />
          </ul>
        </li>
      ))}
    </ul>

    <hr />

    {repository.issues.pageInfo.hasNextPage && (
      <button onClick={onFetchMoreIssues}>More</button>
    )}
  </div>
);

const Organization = ({ organization, errors, onFetchMoreIssues }) => {
  if (errors) {
    return (
      <p>
        <strong>Something went wrong:</strong>
        {errors.map((error) => error.message).join(" ")}
      </p>
    );
  }

  return (
    <div>
      <p>
        <strong>Issues from Organization:&nbsp;</strong>
        <a href={organization.url}>{organization.name}</a>
      </p>
      <Repository
        repository={organization.repository}
        onFetchMoreIssues={onFetchMoreIssues}
      />
    </div>
  );
};

export { Organization };
