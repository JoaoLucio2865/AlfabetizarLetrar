import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  /* Estilos definidos em GlobalStyles.js */
`;

const Input = ({ type = 'text', placeholder, value, onChange, name, id }) => {
  return (
    <StyledInput
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      id={id}
    />
  );
};

export default Input;
