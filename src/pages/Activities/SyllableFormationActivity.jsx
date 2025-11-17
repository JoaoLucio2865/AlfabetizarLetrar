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
import { useSearchParams } from 'react-router-dom';  // Novo: Para pegar ID da URL

// Função auxiliar para síntese de voz
const speak = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
  }
};

// Componente ajustado para DropTargetArea com useDrop
const EnhancedDropTargetArea = ({ onDropLetter, children, letterStyle }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'letter',
    drop: (item) => {
      console.log('Dropped letter:', item.letter);  // Debug: Log para verificar drop
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

const SyllableFormationActivity = () => {
  const [searchParams] = useSearchParams();  // Novo: Para pegar ID da URL
  const activityId = searchParams.get('id');  // Ex.: /activity/syllable-formation?id=1

  const [activity, setActivity] = useState(null);
  const [availableLetters, setAvailableLetters] = useState([]);
  const [droppedLetters, setDroppedLetters] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
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
        response = await api.get(`/activities/${activityId}`);  // Busca por ID
        const activityData = response.data;
        if (activityData && activityData.type === 'syllables') {
          setActivity(activityData);
          setAvailableLetters(activityData.items);
          speak(`Atividade carregada: ${activityData.title}`);
        } else {
          setError('Atividade não encontrada ou não é de sílabas.');
        }
      } else {
        response = await api.get('/activities?type=syllables');  // Busca primeira de sílabas
        const activityData = response.data[0];
        if (activityData) {
          setActivity(activityData);
          setAvailableLetters(activityData.items);
          speak(`Atividade carregada: ${activityData.title}`);
        } else {
          setError('Nenhuma atividade de sílabas encontrada.');
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

  const saveProgress = async (score, submission = '') => {
    try {
      await api.post('/progress', { activity_id: activity.id, score, submission });
      speak('Progresso salvo.');
    } catch (err) {
      console.error('Erro ao salvar progresso:', err);
    }
  };

  const handleDropLetter = (letter) => {
    console.log('Handling drop for letter:', letter);  // Debug: Log para verificar
    if (!droppedLetters.includes(letter)) {
      setDroppedLetters((prev) => [...prev, letter]);
      setAvailableLetters((prev) => prev.filter((l) => l !== letter));
    }
  };

  const handleOperatorClick = (operator) => {
    if (operator === '+') {
      const formedWord = droppedLetters.join('');
      setCurrentWord(formedWord);
      speak(formedWord);
      setFeedback(null);
    } else if (operator === '-') {
      setAvailableLetters((prev) => [...prev, ...droppedLetters]);
      setDroppedLetters([]);
      setCurrentWord('');
      setFeedback(null);
    } else if (operator === '=') {
      const target = activity ? activity.items.join('').toUpperCase() : 'CASA';
      if (operator === '=') {
        const target = activity ? activity.items.join('').toUpperCase() : 'CASA';
        if (currentWord.toUpperCase() === target) {
          setFeedback({ message: 'Parabéns! Você acertou!', isCorrect: true });
          playSound('success');
          saveProgress(100);
        } else {
          setFeedback({ message: `Tente novamente. A palavra correta é ${target}`, isCorrect: false });
          playSound('error');
          speak(target);
        }
      }      
    }
  };

  const handleReset = () => {
    setAvailableLetters(activity ? activity.items : ['C', 'A', 'S', 'A']);
    setDroppedLetters([]);
    setCurrentWord('');
    setFeedback(null);
    localStorage.removeItem('formedText');
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
          <Instruction>Arraste as letras para formar a palavra e use os operadores!</Instruction>

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
              word={currentWord || droppedLetters.join('')}
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

export default SyllableFormationActivity;