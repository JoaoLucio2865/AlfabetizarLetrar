import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';  // Ajuste caminho

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

const AdminDashboard = () => {
  const { user } = useAuth();
  const adminName = user?.name || 'Admin';

  if (!user || user.role !== 'admin') {
    return <div>Acesso negado. Faça login como administrador.</div>;
  }

  // Dados simulados para admin (ex.: stats de usuários/atividades)
  const adminStats = {
    totalStudents: 15,
    totalActivities: 8,
    pendingReviews: 3,
  };

  return (
    <DashboardContainer>
      <WelcomeMessage>Painel do Administrador - Olá, {adminName}!</WelcomeMessage>

      <Section>
        <SectionTitle>Estatísticas Gerais</SectionTitle>
        <p><strong>Total de Alunos:</strong> {adminStats.totalStudents}</p>
        <p><strong>Total de Atividades Criadas:</strong> {adminStats.totalActivities}</p>
        <p><strong>Atividades Pendentes:</strong> {adminStats.pendingReviews}</p>
      </Section>

      <Section>
        <SectionTitle>Ações Administrativas</SectionTitle>
        <div style={{ textAlign: 'center' }}>
          <AdminButton to="/create-activity">Criar Nova Atividade</AdminButton>
          <AdminButton to="/upcoming-activities">Ver Atividades dos Alunos</AdminButton>
          <AdminButton to="/admin/users">Gerenciar Usuários</AdminButton>
          <AdminButton to="/progress">Ver Progresso Geral</AdminButton>
        </div>
      </Section>
    </DashboardContainer>
  );
};

export default AdminDashboard;