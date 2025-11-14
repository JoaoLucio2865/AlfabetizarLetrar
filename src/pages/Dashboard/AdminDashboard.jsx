import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';  // Ajuste caminho
import api from '../../services/api';  // Novo: Import da API

const speak = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';  // Idioma português
    window.speechSynthesis.speak(utterance);
  }
};

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeMessage = styled.h1`
  margin-bottom: 2rem;
  text-align: center;
  color: var(--primary-color);
`;

const Section = styled.section`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: var(--primary-color);
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
`;

const AdminButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  background-color: var(--secondary-color);
  color: white;
  border-radius: 5px;
  font-size: 1.2rem;
  text-decoration: none;
  margin: 0.5rem;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #dc3545;  // Vermelho para admin actions
    text-decoration: none;
  }
`;

const QuickCreateButton = styled.button`
  display: inline-block;
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  margin: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: var(--primary-color);
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: red;
  margin-bottom: 1rem;
`;

const ReloadButton = styled.button`
  display: block;
  margin: 1rem auto;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const AdminDashboard = () => {
  const { user } = useAuth();
  const adminName = user?.name || 'Admin';

  const [adminStats, setAdminStats] = useState({
    totalStudents: 0,
    totalActivities: 0,
    pendingReviews: 0,
    activities: [],  // Lista de atividades criadas
    pendingProgress: [],  // Progresso pendente para validação
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, activitiesRes, progressRes, pendingRes] = await Promise.all([
        api.get('/users'),
        api.get('/activities'),
        api.get('/progress'),
        api.get('/progress/pending'),  // Novo: Busca progresso pendente
      ]);

      const totalStudents = usersRes.data.filter(u => u.role === 'student').length;
      const totalActivities = activitiesRes.data.length;
      const pendingReviews = progressRes.data.filter(p => !p.completed_at).length;

      setAdminStats({
        totalStudents,
        totalActivities,
        pendingReviews,
        activities: activitiesRes.data,  // Armazena atividades
        pendingProgress: pendingRes.data,  // Armazena progresso pendente
      });

      speak(`Painel carregado com sucesso. Total de alunos: ${totalStudents}.`);  // Feedback de voz
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar estatísticas. Verifique sua conexão.');
      speak('Erro ao carregar painel. Tente recarregar.');  // Feedback auditivo
    } finally {
      setLoading(false);
    }
  };

  // Função para validar progresso (dentro do componente)
  const validateProgress = async (id, status) => {
    try {
      await api.patch(`/progress/${id}/validate`, { status });
      alert('Progresso validado!');
      speak('Progresso validado com sucesso.');  // Feedback de voz
      fetchAdminData();  // Recarrega dados
    } catch (err) {
      alert('Erro ao validar.');
      speak('Erro ao validar progresso.');  // Feedback auditivo
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <div>Acesso negado. Faça login como administrador.</div>;
  }

  if (loading) {
    return <LoadingMessage>Carregando painel administrativo...</LoadingMessage>;
  }

  return (
    <DashboardContainer>
      <WelcomeMessage>Painel do Administrador - Olá, {adminName}!</WelcomeMessage>

      {error && (
        <ErrorMessage>
          {error}
          <ReloadButton onClick={fetchAdminData}>Recarregar</ReloadButton>
        </ErrorMessage>
      )}

      <Section>
        <SectionTitle>Estatísticas Gerais</SectionTitle>
        <p><strong>Total de Alunos:</strong> {adminStats.totalStudents}</p>
        <p><strong>Total de Atividades Criadas:</strong> {adminStats.totalActivities}</p>
        <p><strong>Atividades Pendentes:</strong> {adminStats.pendingReviews}</p>
      </Section>

      {/* Nova seção: Atividades Criadas */}
      <Section>
        <SectionTitle>Atividades Criadas</SectionTitle>
        <ul>
          {adminStats.activities?.map(activity => (
            <li key={activity.id}>{activity.title} - Tipo: {activity.type}</li>
          ))}
        </ul>
      </Section>

      {/* Nova seção: Acompanhamento de Alunos */}
      <Section>
        <SectionTitle>Acompanhamento de Alunos</SectionTitle>
        <p>Progresso pendente para validação:</p>
        <ul>
          {adminStats.pendingProgress?.map(progress => (
            <li key={progress.id}>
              Aluno: {progress.user.name} - Atividade: {progress.activity.title} - Status: {progress.status}
              <button onClick={() => validateProgress(progress.id, 'approved')}>Aprovar</button>
              <button onClick={() => validateProgress(progress.id, 'rejected')}>Rejeitar</button>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionTitle>Ações Administrativas</SectionTitle>
        <div style={{ textAlign: 'center' }}>
          <QuickCreateButton onClick={() => speak('Redirecionando para criar atividade.')}>
            <Link to="/create-activity" style={{ color: 'white', textDecoration: 'none' }}>
              Criar Nova Atividade
            </Link>
          </QuickCreateButton>
          <AdminButton to="/activities">Ver Atividades dos Alunos</AdminButton>
          <AdminButton to="/admin/users">Gerenciar Usuários</AdminButton>
          <AdminButton to="/progress">Ver Progresso Geral</AdminButton>
        </div>
      </Section>
    </DashboardContainer>
  );
};

export default AdminDashboard;