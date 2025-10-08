import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const AdminDashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeMessage = styled.h1`
  margin-bottom: 2rem;
  text-align: center;
  color: var(--primary-color);
`;

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const AdminCard = styled(Link)`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  text-decoration: none;
  color: var(--text-color);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }

  h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  p {
    font-size: 1rem;
    color: #666;
  }
`;

const AdminDashboard = () => {
  return (
    <AdminDashboardContainer>
      <WelcomeMessage>Bem-vindo(a), Administrador(a)!</WelcomeMessage>

      <AdminGrid>
        <AdminCard to="/admin/students">
          <h3>Gerenciar Alunos</h3>
          <p>Visualize e monitore o progresso dos alunos.</p>
        </AdminCard>

        <AdminCard to="/admin/activities">
          <h3>Gerenciar Atividades</h3>
          <p>Crie, edite e organize as atividades de alfabetização.</p>
        </AdminCard>

        <AdminCard to="/admin/reports">
          <h3>Relatórios</h3>
          <p>Acesse relatórios detalhados de desempenho e uso.</p>
        </AdminCard>

        <AdminCard to="/admin/settings">
          <h3>Configurações</h3>
          <p>Ajuste as configurações gerais do sistema.</p>
        </AdminCard>
      </AdminGrid>
    </AdminDashboardContainer>
  );
};

export default AdminDashboard;
