import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';  // Ajuste caminho
import { Navigate } from 'react-router-dom';

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: var(--primary-color);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-right: 1rem;
  &:hover { background: #ffb300; }
  &:disabled { background: #ccc; cursor: not-allowed; }
`;

const Preview = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f9f9f9;
`;

const CreateActivityPage = () => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  const [title, setTitle] = useState('');
  const [type, setType] = useState('syllables');  // 'syllables' ou 'words'
  const [items, setItems] = useState('');  // Ex.: "CA,SA,A" para CASA
  const [level, setLevel] = useState('easy');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !items) {
      alert('Preencha título e itens!');
      return;
    }

    setLoading(true);
    try {
      // Mock: Salva em localStorage (integre API depois)
      const activities = JSON.parse(localStorage.getItem('activities') || '[]');
      const newActivity = {
        id: Date.now(),
        title,
        type,
        items: items.split(',').map(i => i.trim()),  // Ex.: ['CA', 'SA', 'A']
        level,
        createdBy: user.name,
        createdAt: new Date().toISOString()
      };
      activities.push(newActivity);
      localStorage.setItem('activities', JSON.stringify(activities));

      alert(`Atividade "${title}" criada com sucesso!`);
      // Limpa form ou redireciona
      setTitle(''); setItems(''); setType('syllables'); setLevel('easy');
    } catch (error) {
      alert('Erro ao criar atividade.');
    }
    setLoading(false);
  };

  const previewItems = items ? items.split(',').map(i => i.trim()).join(' + ') : 'Ex.: CA,SA,A';

  return (
    <Container>
      <h1 style={{ textAlign: 'center', color: 'var(--primary-color)' }}>Criar Nova Atividade</h1>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Título da Atividade</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex.: Formar a palavra CASA"
          />
        </FormGroup>

        <FormGroup>
          <Label>Tipo</Label>
          <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', padding: '0.8rem' }}>
            <option value="syllables">Formação de Sílabas</option>
            <option value="words">Formação de Palavras</option>
          </select>
        </FormGroup>

        <FormGroup>
          <Label>Itens Arrastáveis (separados por vírgula)</Label>
          <Input
            type="text"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            placeholder="Ex.: CA,SA,A (para CASA)"
          />
          <small>Preview: {previewItems} = {previewItems.replace(/,/g, '')}</small>
        </FormGroup>

        <FormGroup>
          <Label>Nível de Dificuldade</Label>
          <select value={level} onChange={(e) => setLevel(e.target.value)} style={{ width: '100%', padding: '0.8rem' }}>
            <option value="easy">Fácil</option>
            <option value="medium">Médio</option>
            <option value="hard">Difícil</option>
          </select>
        </FormGroup>

        <div style={{ textAlign: 'center' }}>
          <Button type="submit" disabled={loading || !title || !items}>
            {loading ? 'Criando...' : 'Criar Atividade'}
          </Button>
          <Button type="button" onClick={() => window.history.back()}>Cancelar</Button>
        </div>
      </form>

      <Preview>
        <h3>Preview da Atividade</h3>
        <p><strong>Título:</strong> {title || 'Não definido'}</p>
        <p><strong>Tipo:</strong> {type === 'syllables' ? 'Sílabas' : 'Palavras'}</p>
        <p><strong>Itens:</strong> Arraste {previewItems} para formar a palavra.</p>
        <p><strong>Nível:</strong> {level}</p>
      </Preview>
    </Container>
  );
};

export default CreateActivityPage;