import React from 'react';
import styled from 'styled-components';

const ProgressPageContainer = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
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

const ChartPlaceholder = styled.div`
  background-color: #f0f0f0;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
  border-radius: 5px;
  font-style: italic;
`;

const ActivityHistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    border: 1px solid #ddd;
    padding: 0.8rem;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }
`;

const StudentProgressPage = () => {
  // Dados simulados de histórico
  const activityHistory = [
    { id: 1, date: '2025-07-20', activity: 'Formação de Sílabas - Nível 1', score: '85%', time: '15 min' },
    { id: 2, date: '2025-07-21', activity: 'Leitura de Palavras Simples', score: '70%', time: '20 min' },
    { id: 3, date: '2025-07-22', activity: 'Operadores Matemáticos - Soma', score: '90%', time: '10 min' },
  ];

  return (
    <ProgressPageContainer>
      <Title>Seu Progresso Detalhado</Title>

      <Section>
        <SectionTitle>Desempenho ao Longo do Tempo</SectionTitle>
        <ChartPlaceholder>
          Gráfico de progresso (ex: com Recharts ou Chart.js)
        </ChartPlaceholder>
      </Section>

      <Section>
        <SectionTitle>Histórico de Atividades</SectionTitle>
        <ActivityHistoryTable>
          <thead>
            <tr>
              <th>Data</th>
              <th>Atividade</th>
              <th>Pontuação</th>
              <th>Tempo</th>
            </tr>
          </thead>
          <tbody>
            {activityHistory.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.activity}</td>
                <td>{item.score}</td>
                <td>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </ActivityHistoryTable>
      </Section>

      <Section>
        <SectionTitle>Conquistas</SectionTitle>
        <p>Nenhuma conquista desbloqueada ainda. Continue praticando!</p>
        {/* Aqui você pode listar conquistas ou badges */}
      </Section>
    </ProgressPageContainer>
  );
};

export default StudentProgressPage;
