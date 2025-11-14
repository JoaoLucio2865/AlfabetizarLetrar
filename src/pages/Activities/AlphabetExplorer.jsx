import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Howl } from 'howler'; // Para áudio
import Button from '../../components/common/Button';

// Certifique-se de importar a fonte no index.html:
// <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet">

// Animação para cursor piscando
const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

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
  font-family: 'Dancing Script', cursive;
  font-size: 3rem;
  color: #6a1b9a;
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

const StyleButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const StyleButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #0056b3;
  }
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
  word-break: break-all;
  font-family: ${(props) => (props.keyboardStyle.includes('cursive') ? "'Dancing Script', cursive" : 'inherit')};
  color: ${(props) => (props.keyboardStyle.includes('cursive') ? '#6a1b9a' : 'var(--text-color)')};
  text-transform: ${(props) => (props.keyboardStyle === 'lowercase' || props.keyboardStyle === 'cursive-lowercase' ? 'lowercase' : 'uppercase')};
  position: relative;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 5px;
  height: 3.5rem;
  background-color: ${(props) => (props.keyboardStyle.includes('cursive') ? '#6a1b9a' : 'var(--text-color)')};
  animation: ${blink} 1s infinite;
  margin-left: 2px;
`;

const WordBuilderControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const StyledButton = styled(Button)`
  font-family: ${(props) => (props.keyboardStyle.includes('cursive') ? "'Dancing Script', cursive" : 'inherit')};
  color: ${(props) => (props.keyboardStyle.includes('cursive') ? '#6a1b9a' : 'inherit')};
  font-size: ${(props) => (props.keyboardStyle.includes('cursive') ? '1.5rem' : '1rem')};
  text-transform: ${(props) => (props.keyboardStyle === 'lowercase' || props.keyboardStyle === 'cursive-lowercase' ? 'lowercase' : 'uppercase')};
  background-color: white;
  border: 1px solid #ddd;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const KeyboardHint = styled.p`
  font-size: 0.9rem;
  color: #777;
  margin-top: 1rem;
`;

const AlphabetExplorer = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [currentWord, setCurrentWord] = useState('');
  const [keyboardStyle, setKeyboardStyle] = useState('uppercase');

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
    playSound(letter);
  };

  const handleAddToWord = (letter) => {
    let styledLetter = letter;
    if (keyboardStyle === 'lowercase') {
      styledLetter = letter.toLowerCase();
    } else if (keyboardStyle === 'cursive-uppercase') {
      styledLetter = letter;
    } else if (keyboardStyle === 'cursive-lowercase') {
      styledLetter = letter.toLowerCase();
    }
    setCurrentWord((prev) => prev + styledLetter);
    speak(styledLetter);
  };

  const handleAddSpace = () => {
    setCurrentWord((prev) => prev + ' ');
    speak('espaço');
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

  const handleKeyboardStyleChange = (style) => {
    setKeyboardStyle(style);
    speak(`Teclado alterado para ${style === 'uppercase' ? 'maiúsculo' : style === 'lowercase' ? 'minúsculo' : style === 'cursive-uppercase' ? 'cursiva maiúsculo' : 'cursiva minúsculo'}`);
  };

  const handleKeyPress = (event) => {
    const key = event.key.toUpperCase();
    if (alphabet.includes(key) && !event.ctrlKey && !event.altKey && !event.metaKey) {
      event.preventDefault();
      handleAddToWord(key);
    } else if (event.key === ' ') {
      event.preventDefault();
      console.log('Espaço pressionado');  // Log para depuração
      handleAddSpace();
    } else if (event.key === 'Backspace') {
      event.preventDefault();
      handleRemoveLastLetter();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      handleSpeakWord();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      handleClearWord();
    }
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
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
            <LetterDisplay>{letter}</LetterDisplay>
            <LetterDisplay style={{ fontSize: '2rem' }}>{letter.toLowerCase()}</LetterDisplay>
            <CursiveLetter>{letter}</CursiveLetter>
            <CursiveLetter style={{ fontSize: '2.5rem' }}>{letter.toLowerCase()}</CursiveLetter>
          </LetterCard>
        ))}
      </AlphabetGrid>

      <WordBuilderSection>
        <WordBuilderTitle>Construa Sua Palavra</WordBuilderTitle>
        <StyleButtons>
          <StyleButton onClick={() => handleKeyboardStyleChange('uppercase')}>Maiúsculas</StyleButton>
          <StyleButton onClick={() => handleKeyboardStyleChange('lowercase')}>Minúsculas</StyleButton>
          <StyleButton onClick={() => handleKeyboardStyleChange('cursive-uppercase')}>Cursiva Maiúsculo</StyleButton>
          <StyleButton onClick={() => handleKeyboardStyleChange('cursive-lowercase')}>Cursiva Minúsculo</StyleButton>
        </StyleButtons>
        <CurrentWordDisplay keyboardStyle={keyboardStyle}>
          {currentWord || 'Sua palavra aparecerá aqui...'}
          {currentWord && <Cursor keyboardStyle={keyboardStyle} />}
        </CurrentWordDisplay>
        <WordBuilderControls>
          {alphabet.map((letter) => {
            let displayLetter = letter;
            if (keyboardStyle === 'lowercase' || keyboardStyle === 'cursive-lowercase') {
              displayLetter = letter.toLowerCase();
            }
            return (
              <StyledButton
                key={`add-${letter}`}
                keyboardStyle={keyboardStyle}
                onClick={() => handleAddToWord(letter)}
              >
                {displayLetter}
              </StyledButton>
            );
          })}
          <StyledButton keyboardStyle={keyboardStyle} onClick={handleAddSpace}>Espaço</StyledButton>
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
        <KeyboardHint>
          Dica: Use o teclado físico para digitar letras (A-Z), espaço para adicionar espaço, Backspace para apagar, Enter para falar a palavra, Escape para limpar.
        </KeyboardHint>
      </WordBuilderSection>
    </AlphabetContainer>
  );
};

export default AlphabetExplorer;