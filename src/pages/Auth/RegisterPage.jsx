import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
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

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    // Simulação de registro
    console.log('Dados de registro:', { name, email, password });
    // Em um app real, você faria uma requisição axios para o backend
    // para registrar o usuário.
    alert('Cadastro realizado com sucesso! Faça login para continuar.');
    navigate('/login');
  };

  return (
    <AuthContainer>
      <AuthBox>
        <Title>Cadastro</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Nome Completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <Input
            type="password"
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">Cadastrar</Button>
        </Form>
        <p style={{ marginTop: '1rem' }}>
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </AuthBox>
    </AuthContainer>
  );
};

export default RegisterPage;
