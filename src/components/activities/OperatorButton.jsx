import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

const StyledOperatorButton = styled(Button)`
  background-color: #007bff; /* Azul para operadores */
  font-size: 2rem;
  width: 70px;
  height: 70px;
  border-radius: 50%; /* Botões redondos */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #0056b3;
  }
`;

const OperatorButton = ({ operator, onClick }) => {
  return (
    <StyledOperatorButton onClick={onClick}>
      {operator}
    </StyledOperatorButton>
  );
};

export default OperatorButton;
