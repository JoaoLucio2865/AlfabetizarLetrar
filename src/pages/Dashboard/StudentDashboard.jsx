import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';  // ← Novo: Import do context (ajuste caminho)
import ProgressOverview from '../../components/dashboard/ProgressOverview';
import ActivityList from '../../components/dashboard/ActivityList';

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

const StudentDashboard = () => {
  const { user } = useAuth();
  const studentName = user?.name || 'Aluno';
  const progressData = {
    syllables: 75,
    words: 60,
    phrases: 40,
  };
  const recentActivities = [
    { id: 1, name: "Formação de Sílabas - Nível 1", status: "Concluído", score: "85%" },
    { id: 2, name: "Leitura de Palavras Simples", status: "Em Andamento", score: "50%" },
    { id: 3, name: "Formação de Palavras - CASA", status: "Pendente", score: "0%" },  // Exemplo nova atividade
  ];

  if (!user) {
    return <div>Carregando... ou faça login novamente.</div>;
  }

  return (
    <DashboardContainer>
      <WelcomeMessage>Bem-vindo(a), {studentName}!</WelcomeMessage>

      <Section>
        <SectionTitle>Seu Progresso Geral</SectionTitle>
        <ProgressOverview data={progressData} />
      </Section>

      <Section>
        <SectionTitle>Atividades Recentes</SectionTitle>
        <ActivityList activities={recentActivities} />
      </Section>

      <CallToAction>
        <Link to="/upcoming-activities">Ver Atividades Próximas</Link>  {/* Atualizado: Para lista de atividades */}
        <br />
        <Link to="/activity/syllable-formation" style={{ marginTop: '1rem', display: 'inline-block' }}>
          Começar Atividade de Sílabas
        </Link>
      </CallToAction>
    </DashboardContainer>
  );
};

export default StudentDashboard;