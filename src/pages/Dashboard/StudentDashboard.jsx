import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';  // Import do context
import ProgressOverview from '../../components/dashboard/ProgressOverview';
import ActivityList from '../../components/dashboard/ActivityList';
import api from '../../services/api';  // Novo: Import da API

// Função auxiliar para síntese de voz
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

const ActivityItem = styled.div`
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActivityLink = styled(Link)`
  color: var(--primary-color);
  text-decoration: none;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

const CallToAction = styled.div`
  text-align: center;
  margin-top: 3rem;
  a {
    display: inline-block;
    padding: 1rem 2rem;
    background-color: var(--secondary-color);
    color: white;
    border-radius: 5px;
    font-size: 1.2rem;
    text-decoration: none;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: #ffb300;
      text-decoration: none;
    }
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

const StudentDashboard = () => {
  const { user } = useAuth();
  const studentName = user?.name || 'Aluno';

  const [progressData, setProgressData] = useState({ syllables: 0, words: 0, phrases: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [availableActivities, setAvailableActivities] = useState([]);  // Novo: Atividades disponíveis
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para mapear tipo de atividade para rota
  const getActivityLink = (type) => {
    switch (type) {
      case 'syllables':
        return '/activity/syllable-formation';
      case 'words':
        return '/activity/word-reading';  // Ou '/activity/word-writing' se preferir
      case 'phrases':
        return '/activity/phrase-formation';  // Crie se necessário
      default:
        return '#';  // Placeholder
    }
  };

  // Função para buscar dados do backend
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [progressRes, activitiesRes] = await Promise.all([
        api.get('/progress'),
        api.get('/activities'),
      ]);

      const progress = progressRes.data;
      const syllablesAvg = progress.filter(p => p.activity.type === 'syllables').reduce((sum, p) => sum + p.score, 0) / Math.max(progress.filter(p => p.activity.type === 'syllables').length, 1);
      const wordsAvg = progress.filter(p => p.activity.type === 'words').reduce((sum, p) => sum + p.score, 0) / Math.max(progress.filter(p => p.activity.type === 'words').length, 1);
      const phrasesAvg = progress.filter(p => p.activity.type === 'phrases').reduce((sum, p) => sum + p.score, 0) / Math.max(progress.filter(p => p.activity.type === 'phrases').length, 1);

      setProgressData({
        syllables: Math.round(syllablesAvg) || 0,
        words: Math.round(wordsAvg) || 0,
        phrases: Math.round(phrasesAvg) || 0,
      });

      // Atividades recentes (últimas 3 com progresso)
      const activities = activitiesRes.data.slice(0, 3).map(activity => {
        const userProgress = progress.find(p => p.activity_id === activity.id);
        return {
          id: activity.id,
          name: activity.title,
          status: userProgress ? (userProgress.completed_at ? 'Concluído' : 'Em Andamento') : 'Pendente',
          score: userProgress ? `${userProgress.score}%` : '0%',
        };
      });
      setRecentActivities(activities);

      // Todas as atividades disponíveis
      setAvailableActivities(activitiesRes.data);

      speak(`Bem-vindo, ${studentName}! Seu progresso foi carregado.`);  // Feedback de voz
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar dados. Verifique sua conexão.');
      speak('Erro ao carregar dados. Tente recarregar.');  // Feedback auditivo
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (!user) {
    return <div>Carregando... ou faça login novamente.</div>;
  }

  if (loading) {
    return <LoadingMessage>Carregando seu progresso...</LoadingMessage>;
  }

  return (
    <DashboardContainer>
      <WelcomeMessage>Bem-vindo(a), {studentName}!</WelcomeMessage>

      {error && (
        <ErrorMessage>
          {error}
          <ReloadButton onClick={fetchDashboardData}>Recarregar</ReloadButton>
        </ErrorMessage>
      )}

      <Section>
        <SectionTitle>Seu Progresso Geral</SectionTitle>
        <ProgressOverview data={progressData} />
      </Section>

      <Section>
        <SectionTitle>Atividades Recentes</SectionTitle>
        <ActivityList activities={recentActivities} />
      </Section>

      <Section>
        <SectionTitle>Atividades Disponíveis</SectionTitle>
        {availableActivities.length > 0 ? (
          availableActivities.map(activity => (
            <ActivityItem key={activity.id}>
              <div>
                <strong>{activity.title}</strong> - Nível: {activity.level} - Tipo: {activity.type}
              </div>
              <ActivityLink
                to={getActivityLink(activity.type)}
                onClick={() => speak(`Iniciando atividade: ${activity.title}`)}
              >
                Praticar
              </ActivityLink>
            </ActivityItem>
          ))
        ) : (
          <p>Nenhuma atividade disponível. Peça ao administrador para criar uma.</p>
        )}
      </Section>

      <CallToAction>
        <Link to="/activities">Ver Todas as Atividades</Link>
        <br />
        <Link to="/activity/syllable-formation" style={{ marginTop: '1rem', display: 'inline-block' }}>
          Começar Atividade de Sílabas
        </Link>
      </CallToAction>
    </DashboardContainer>
  );
};

export default StudentDashboard;