import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--background-color);
`;

const LoginForm = styled.form`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const LoginPage = () => {
  const [name, setName] = useState('');  // Novo: Campo para nome
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);  // Para mostrar campo senha apenas para admin
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Função para verificar role ao digitar nome
  const checkRole = async (name) => {
    if (!name) return;
    try {
      const response = await api.get(`/users/check-role?name=${name}`);  // Busca por name
      if (response.data.role === 'admin') {
        setShowPassword(true);  // Mostra campo senha para admin
      } else {
        setShowPassword(false);  // Esconde para alunos
      }
    } catch (err) {
      setShowPassword(false);  // Fallback: trata como aluno
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    checkRole(e.target.value);  // Verifica role ao digitar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (showPassword) {
        // Login com senha para admin
        await login({ name, password });  // Ajuste AuthContext para usar name
      } else {
        // Login direto para alunos (sem senha)
        await login({ name, password: '' });  // Ajuste no AuthContext se necessário
      }
      navigate('/dashboard');  // Redireciona para dashboard
    } catch (err) {
      alert('Erro no login. Verifique credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <h2>Login</h2>
        <Input
          type="text"
          placeholder="Nome de Usuário"
          value={name}
          onChange={handleNameChange}
          required
        />
        {showPassword && (
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;