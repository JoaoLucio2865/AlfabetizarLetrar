import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px); /* Ajuste para o Header */
  background-color: var(--background-color);
`;

const AuthBox = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: var(--primary-color);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ErrorMessage = styled.p`
  color: var(--error-color);
  margin-top: -0.5rem;
  margin-bottom: 1rem;
`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simulação de autenticação
    if (email === 'aluno@teste.com' && password === '123456') {
      console.log('Login de aluno bem-sucedido!');
      // Em um app real, você faria uma requisição axios para o backend
      // e armazenaria o token JWT.
      navigate('/dashboard');
    } else if (email === 'admin@teste.com' && password === 'admin123') {
      console.log('Login de admin bem-sucedido!');
      navigate('/dashboard'); // O App.jsx redirecionará para o dashboard de admin
    }
    else {
      setError('E-mail ou senha inválidos.');
    }
  };

  return (
    <AuthContainer>
      <AuthBox>
        <Title>Login</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">Entrar</Button>
        </Form>
        <p style={{ marginTop: '1rem' }}>
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </AuthBox>
    </AuthContainer>
  );
};

export default LoginPage;
