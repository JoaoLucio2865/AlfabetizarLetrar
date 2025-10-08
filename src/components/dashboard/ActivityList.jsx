import React from 'react';
import styled from 'styled-components';

const ActivityTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    border: 1px solid #ddd;
    padding: 0.8rem;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }
`;

const ActivityList = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return <p>Nenhuma atividade recente para exibir.</p>;
  }

  return (
    <ActivityTable>
      <thead>
        <tr>
          <th>Atividade</th>
          <th>Status</th>
          <th>Pontuação</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((activity) => (
          <tr key={activity.id}>
            <td>{activity.name}</td>
            <td>{activity.status}</td>
            <td>{activity.score}</td>
          </tr>
        ))}
      </tbody>
    </ActivityTable>
  );
};

export default ActivityList;
