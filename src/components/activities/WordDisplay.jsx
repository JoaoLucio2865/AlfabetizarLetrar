import React from 'react';
import styled from 'styled-components';

const DisplayBox = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: var(--text-color);
  min-width: 200px;
  text-align: center;
  padding: 0.5rem;
  border-bottom: 2px solid var(--primary-color);
`;

const WordDisplay = ({ word }) => {
  return (
    <DisplayBox>
      {word || 'Arraste as letras aqui'}
    </DisplayBox>
  );
};

export default WordDisplay;
