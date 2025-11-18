import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Howl } from 'howler';
import DraggableLetter from '../../components/activities/DraggableLetter';
import DropTargetArea from '../../components/activities/DropTargetArea';
import OperatorButton from '../../components/activities/OperatorButton';
import WordDisplay from '../../components/activities/WordDisplay';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { useSearchParams } from 'react-router-dom';

const speak = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
  }
};

const EnhancedDropTargetArea = ({ onDropLetter, children, letterStyle }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'letter',
    drop: (item) => {
      onDropLetter(item.letter);
      speak(`Letra ${item.letter} adicionada.`);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        border: isOver ? '2px dashed var(--primary-color)' : '2px dashed #ccc',
        padding: '1rem',
        minHeight: '100px',
        backgroundColor: isOver ? '#f0f8ff' : 'white',
        textTransform: letterStyle === 'uppercase' ? 'uppercase' : letterStyle === 'lowercase' ? 'lowercase' : 'none',
        fontStyle: letterStyle === 'italic' ? 'italic' : 'normal',
      }}
    >
      {children}
    </div>
  );
};

const ActivityContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: var(--background-color);
  min-height: calc(100vh - 80px);
`;

const ActivityBox = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  text-align: center;
`;

const Instruction = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #555;
`;

const LettersContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const OperatorsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
`;

const StyleButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StyleButton = styled.button`
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

const FeedbackMessage = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 1.5rem;
  color: ${(props) => (props.isCorrect ? 'var(--primary-color)' : 'var(--error-color)')};
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

const PhraseFormation = () => {
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('id');

  const [activity, setActivity] = useState(null);
  const [availableLetters, setAvailableLetters] = useState([]);
  const [droppedLetters, setDroppedLetters] = useState([]);
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [letterStyle, setLetterStyle] = useState('uppercase');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const playSound = (type) => {
    let sound;
    if (type === 'success') {
      sound = new Howl({ src: ['/sounds/success.mp3'] });
    } else if (type === 'error') {
      sound = new Howl({ src: ['/sounds/error.mp3'] });
    }
    if (sound) sound.play();
  };

  const fetchActivity = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (activityId) {
        response = await api.get(`/activities/${activityId}`);
        const activityData = response.data;
        if (activityData && activityData.type === 'phrases') {
          setActivity(activityData);
          // Para frases, separe as letras da frase alvo
          const targetPhrase = activityData.items[0];  // Ex.: 'O GATO É BONITO'
          setAvailableLetters(targetPhrase.split('').filter(char => char !== ' '));  // Remove espaços
          speak(`Atividade carregada: ${activityData.title}`);
        } else {
          setError('Atividade não encontrada ou não é de frases.');
        }
      } else {
        response = await api.get('/activities?type=phrases');
        const activityData = response.data[0];
        if (activityData) {
          setActivity(activityData);
          const targetPhrase = activityData.items[0];
          setAvailableLetters(targetPhrase.split('').filter(char => char !== ' '));
          speak(`Atividade carregada: ${activityData.title}`);
        } else {
          setError('Nenhuma atividade de frases encontrada.');
        }
      }
    } catch (err) {
      console.error('Erro ao buscar atividade:', err);
      setError('Erro ao carregar atividade.');
      speak('Erro ao carregar atividade.');
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (score) => {
    try {
      await api.post('/progress', { activity_id: activity.id, score });
      speak('Progresso salvo.');
    } catch (err) {
      console.error('Erro ao salvar progresso:', err);
    }
  };

  const handleDropLetter = (letter) => {
    if (!droppedLetters.includes(letter)) {
      setDroppedLetters((prev) => [...prev, letter]);
      setAvailableLetters((prev) => prev.filter((l) => l !== letter));
    }
  };

  const handleOperatorClick = (operator) => {
    if (operator === '+') {
      const formedPhrase = droppedLetters.join('');
      setCurrentPhrase(formedPhrase);
      speak(formedPhrase);
      setFeedback(null);
    } else if (operator === '-') {
      setAvailableLetters((prev) => [...prev, ...droppedLetters]);
      setDroppedLetters([]);
      setCurrentPhrase('');
      setFeedback(null);
    } else if (operator === '=') {
      const target = activity ? activity.items[0].replace(/\s/g, '').toUpperCase() : 'OGATOEBONITO';
      if (currentPhrase.toUpperCase() === target) {
        setFeedback({ message: 'Parabéns! Você formou a frase corretamente!', isCorrect: true });
        playSound('success');
        saveProgress(100);
      } else {
        setFeedback({ message: `Tente novamente. A frase correta é ${activity.items[0]}`, isCorrect: false });
        playSound('error');
        speak(activity.items[0]);
      }
    }
  };

  const handleReset = () => {
    const letters = activity ? activity.items[0].split('').filter(char => char !== ' ') : ['O', 'G', 'A', 'T', 'O', 'E', 'B', 'O', 'N', 'I', 'T', 'O'];
    setAvailableLetters(letters);
    setDroppedLetters([]);
    setCurrentPhrase('');
    setFeedback(null);
  };

  const handleStyleChange = (style) => {
    setLetterStyle(style);
    speak(`Estilo alterado para ${style === 'uppercase' ? 'maiúsculo' : style === 'lowercase' ? 'minúsculo' : 'cursivo'}`);
  };

  useEffect(() => {
    fetchActivity();
  }, [activityId]);

  if (loading) {
    return <LoadingMessage>Carregando atividade...</LoadingMessage>;
  }

  if (error) {
    return (
      <ErrorMessage>
        {error}
        <ReloadButton onClick={fetchActivity}>Recarregar</ReloadButton>
      </ErrorMessage>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <ActivityContainer>
        <ActivityBox>
          <Instruction>Arraste as letras para formar a frase e use os operadores!</Instruction>

          <StyleButtons>
            <StyleButton onClick={() => handleStyleChange('uppercase')}>Maiúsculas</StyleButton>
            <StyleButton onClick={() => handleStyleChange('lowercase')}>Minúsculas</StyleButton>
            <StyleButton onClick={() => handleStyleChange('italic')}>Cursiva</StyleButton>
          </StyleButtons>

          <LettersContainer>
            {availableLetters.map((letter, index) => (
              <DraggableLetter
                key={index}
                letter={letter}
                style={{
                  textTransform: letterStyle === 'uppercase' ? 'uppercase' : letterStyle === 'lowercase' ? 'lowercase' : 'none',
                  fontStyle: letterStyle === 'italic' ? 'italic' : 'normal',
                }}
              />
            ))}
          </LettersContainer>

          <EnhancedDropTargetArea onDropLetter={handleDropLetter} letterStyle={letterStyle}>
            <WordDisplay
              word={currentPhrase || droppedLetters.join('')}
              style={{
                textTransform: letterStyle === 'uppercase' ? 'uppercase' : letterStyle === 'lowercase' ? 'lowercase' : 'none',
                fontStyle: letterStyle === 'italic' ? 'italic' : 'normal',
              }}
            />
          </EnhancedDropTargetArea>

          <OperatorsContainer>
            <OperatorButton operator="+" onClick={() => handleOperatorClick('+')} />
            <OperatorButton operator="-" onClick={() => handleOperatorClick('-')} />
            <OperatorButton operator="=" onClick={() => handleOperatorClick('=')} />
          </OperatorsContainer>

          {feedback && (
            <FeedbackMessage isCorrect={feedback.isCorrect}>
              {feedback.message}
            </FeedbackMessage>
          )}

          <Button onClick={handleReset} style={{ marginTop: '2rem' }}>
            Reiniciar Atividade
          </Button>
        </ActivityBox>
      </ActivityContainer>
    </DndProvider>
  );
};

export default PhraseFormation;