import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  /* Estilos definidos em GlobalStyles.js */
`;

const Button = ({ children, onClick, type = 'button', disabled }) => {
  return (
    <StyledButton type={type} onClick={onClick} disabled={disabled}>
      {children}
    </StyledButton>
  );
};

export default Button;
