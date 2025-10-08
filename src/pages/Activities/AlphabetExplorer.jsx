import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Howl } from 'howler'; // Para áudio
import Button from '../../components/common/Button';

// Importe a fonte cursiva no seu index.html ou GlobalStyles.js
// Exemplo para index.html:
// <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet">

const AlphabetContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  background-color: var(--background-color);
  min-height: calc(100vh - 80px);
`;

const Title = styled.h1`
  color: var(--primary-color);
  margin-bottom: 2rem;
`;

const Instruction = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2rem;
`;

const AlphabetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
`;

const LetterCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const LetterDisplay = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 0.5rem;
`;

const CursiveLetter = styled(LetterDisplay)`
  font-family: 'Dancing Script', cursive; /* Use a fonte cursiva aqui */
  font-size: 3rem;
  color: #6a1b9a; /* Um tom de roxo para cursiva */
`;

const WordBuilderSection = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const WordBuilderTitle = styled.h2`
  color: var(--primary-color);
  margin-bottom: 1.5rem;
`;

const CurrentWordDisplay = styled.div`
  min-height: 80px;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: bold;
  color: var(--text-color);
  padding: 1rem;
  word-break: break-all; /* Para palavras longas */
`;

const WordBuilderControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const AlphabetExplorer = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [currentWord, setCurrentWord] = useState('');

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Web Speech API não suportada neste navegador.');
    }
  };

  const playSound = (letter) => {
    speak(letter);
  };

  const handleLetterClick = (letter) => {
    playSound(letter); // Fala a letra clicada
  };

  const handleAddToWord = (letter) => {
    setCurrentWord((prev) => prev + letter);
    speak(letter); // Fala a letra adicionada
  };

  const handleSpeakWord = () => {
    if (currentWord) {
      speak(currentWord);
    }
  };

  const handleClearWord = () => {
    setCurrentWord('');
  };

  const handleRemoveLastLetter = () => {
    setCurrentWord((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
  }, []);

  return (
    <AlphabetContainer>
      <Title>Explorador do Alfabeto</Title>
      <Instruction>
        Clique nas letras para ouvi-las e veja como elas são escritas em diferentes estilos.
        Depois, use as letras para construir suas próprias palavras!
      </Instruction>

      <AlphabetGrid>
        {alphabet.map((letter) => (
          <LetterCard key={letter} onClick={() => handleLetterClick(letter)}>
            <LetterDisplay>{letter}</LetterDisplay> {/* Maiúscula */}
            <LetterDisplay style={{ fontSize: '2rem' }}>{letter.toLowerCase()}</LetterDisplay> {/* Minúscula */}
            <CursiveLetter>{letter}</CursiveLetter> {/* Cursiva Maiúscula */}
            <CursiveLetter style={{ fontSize: '2.5rem' }}>{letter.toLowerCase()}</CursiveLetter> {/* Cursiva Minúscula */}
          </LetterCard>
        ))}
      </AlphabetGrid>

      <WordBuilderSection>
        <WordBuilderTitle>Construa Sua Palavra</WordBuilderTitle>
        <CurrentWordDisplay>{currentWord || 'Sua palavra aparecerá aqui...'}</CurrentWordDisplay>
        <WordBuilderControls>
          {alphabet.map((letter) => (
            <Button key={`add-${letter}`} onClick={() => handleAddToWord(letter)}>
              {letter}
            </Button>
          ))}
          <Button onClick={handleSpeakWord} disabled={!currentWord}>
            Falar Palavra
          </Button>
          <Button onClick={handleRemoveLastLetter} disabled={!currentWord}>
            Apagar Última
          </Button>
          <Button onClick={handleClearWord} disabled={!currentWord}>
            Limpar
          </Button>
        </WordBuilderControls>
      </WordBuilderSection>
    </AlphabetContainer>
  );
};

export default AlphabetExplorer;
