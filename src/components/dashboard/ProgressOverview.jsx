import React from 'react';
import styled from 'styled-components';

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const ProgressCard = styled.div`
  background-color: #e8f5e9; /* Light green */
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const CardTitle = styled.h3`
  color: var(--primary-color);
  margin-bottom: 0.8rem;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 5px;
  height: 20px;
  margin-top: 0.5rem;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: var(--primary-color);
  width: ${(props) => props.percentage}%;
  border-radius: 5px;
  transition: width 0.5s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
`;

const ProgressOverview = ({ data }) => {
  return (
    <ProgressGrid>
      <ProgressCard>
        <CardTitle>Sílabas</CardTitle>
        <p>Progresso: {data.syllables}%</p>
        <ProgressBarContainer>
          <ProgressBarFill percentage={data.syllables}>
            {data.syllables}%
          </ProgressBarFill>
        </ProgressBarContainer>
      </ProgressCard>

      <ProgressCard>
        <CardTitle>Palavras</CardTitle>
        <p>Progresso: {data.words}%</p>
        <ProgressBarContainer>
          <ProgressBarFill percentage={data.words}>
            {data.words}%
          </ProgressBarFill>
        </ProgressBarContainer>
      </ProgressCard>

      <ProgressCard>
        <CardTitle>Frases</CardTitle>
        <p>Progresso: {data.phrases}%</p>
        <ProgressBarContainer>
          <ProgressBarFill percentage={data.phrases}>
            {data.phrases}%
          </ProgressBarFill>
        </ProgressBarContainer>
      </ProgressCard>
    </ProgressGrid>
  );
};

export default ProgressOverview;
