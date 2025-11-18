import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Howl } from 'howler';
import Button from '../../components/common/Button';
import api from '../../services/api';

const ActivityContainer = styled.div`
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

const WordList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
`;

const WordCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const WordDisplay = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 1rem;
`;

const FeedbackMessage = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 1.5rem;
  color: var(--primary-color);
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

const WordReading = () => {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const playSound = (type) => {
    let sound;
    if (type === 'success') {
      sound = new Howl({ src: ['/sounds/success.mp3'] });
    } else if (type === 'error') {
      sound = new Howl({ src: ['/sounds/error.mp3'] });
    }
    if (sound) sound.play();
  };

  const fetchWords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/activities?type=words');  // Busca atividades de palavras
      const activities = response.data;
      if (activities.length > 0) {
        // Extrai palavras dos itens das atividades (ex.: ['CASA', 'GATO'])
        const wordList = activities.flatMap(activity => activity.items);
        setWords(wordList);
        speak('Atividade carregada. Clique nas palavras para ouvi-las.');
      } else {
        setWords(['CASA', 'GATO', 'SOL', 'ÁGUA']);  // Fallback
      }
    } catch (err) {
      console.error('Erro ao buscar palavras:', err);
      setError('Erro ao carregar atividade.');
      speak('Erro ao carregar atividade.');
    } finally {
      setLoading(false);
    }
  };

  const handleWordClick = (word) => {
    speak(word);
    setFeedback(`Você clicou em: ${word}. Tente lê-la em voz alta!`);
    playSound('success');
  };

  const handleNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setFeedback('');
    } else {
      setFeedback('Parabéns! Você leu todas as palavras.');
      speak('Parabéns! Você leu todas as palavras.');
      playSound('success');
    }
  };

  const handlePreviousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setFeedback('');
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  if (loading) {
    return <LoadingMessage>Carregando atividade...</LoadingMessage>;
  }

  if (error) {
    return (
      <ErrorMessage>
        {error}
        <ReloadButton onClick={fetchWords}>Recarregar</ReloadButton>
      </ErrorMessage>
    );
  }

  return (
    <ActivityContainer>
      <Title>Leitura de Palavras</Title>
      <Instruction>
        Clique nas palavras para ouvi-las. Tente lê-las em voz alta e pratique a pronúncia!
      </Instruction>

      <WordList>
        {words.map((word, index) => (
          <WordCard key={index} onClick={() => handleWordClick(word)}>
            <WordDisplay>{word}</WordDisplay>
          </WordCard>
        ))}
      </WordList>

      {feedback && <FeedbackMessage>{feedback}</FeedbackMessage>}

      <div style={{ marginTop: '2rem' }}>
        <Button onClick={handlePreviousWord} disabled={currentWordIndex === 0}>
          Palavra Anterior
        </Button>
        <Button onClick={handleNextWord} disabled={currentWordIndex === words.length - 1}>
          Próxima Palavra
        </Button>
        <Button onClick={() => speak(words[currentWordIndex] || '')}>
          Ouvir Palavra Atual
        </Button>
      </div>
    </ActivityContainer>
  );
};

export default WordReading;