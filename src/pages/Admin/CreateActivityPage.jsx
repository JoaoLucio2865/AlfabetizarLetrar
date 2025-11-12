import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import api from '../../services/api';

const Container = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: var(--primary-color);
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  min-height: 100px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
`;

const CreateActivityPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'syllables',
    items: '',
    level: 'easy'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const itemsArray = formData.items.split(',').map(item => item.trim().toUpperCase());
      const payload = { ...formData, items: itemsArray };
      await api.post('/activities', payload);
      alert('Atividade criada com sucesso!');
      navigate('/admin-dashboard');  // Redireciona para dashboard admin
    } catch (err) {
      setError('Erro ao criar atividade. Verifique os dados.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Criar Nova Atividade</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="title"
          placeholder="Título da Atividade"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <Select name="type" value={formData.type} onChange={handleChange}>
          <option value="syllables">Sílabas</option>
          <option value="words">Palavras</option>
          <option value="phrases">Frases</option>
        </Select>
        <Textarea
          name="items"
          placeholder="Itens separados por vírgula (ex.: CA, SA, A)"
          value={formData.items}
          onChange={handleChange}
          required
        />
        <Select name="level" value={formData.level} onChange={handleChange}>
          <option value="easy">Fácil</option>
          <option value="medium">Médio</option>
          <option value="hard">Difícil</option>
        </Select>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Atividade'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateActivityPage;