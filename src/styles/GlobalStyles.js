import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #4CAF50;
    --secondary-color: #FFC107;
    --text-color: #333;
    --background-color: #f4f7f6;
    --border-color: #ddd;
    --error-color: #f44336;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    color: var(--text-color);
    background-color: var(--background-color);
    line-height: 1.6;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  button {
    cursor: pointer;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 5px;
    background-color: var(--primary-color);
    color: white;
    font-size: 1rem;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #45a049;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }

  input[type="text"],
  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    font-size: 1rem;
  }
`;

export default GlobalStyles;
