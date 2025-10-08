import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Howl } from 'howler'; // Para áudio
import DraggableLetter from '../../components/activities/DraggableLetter';
import DropTargetArea from '../../components/activities/DropTargetArea';
import OperatorButton from '../../components/activities/OperatorButton';
import WordDisplay from '../../components/activities/WordDisplay';
import Button from '../../components/common/Button';

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

const FeedbackMessage = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 1.5rem;
  color: ${(props) => (props.isCorrect ? 'var(--primary-color)' : 'var(--error-color)')};
`;

const SyllableFormationActivity = () => {
  const [availableLetters, setAvailableLetters] = useState(['C', 'A', 'S', 'A']);
  const [droppedLetters, setDroppedLetters] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [feedback, setFeedback] = useState(null); // { message: string, isCorrect: boolean }

  // Exemplo de palavra alvo
  const targetWord = 'CASA';

  // Função para sintetizar voz (usando Web Speech API para simplicidade)
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR'; // Define o idioma para português do Brasil
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Web Speech API não suportada neste navegador.');
      // Fallback para Howler.js com áudios pré-gravados se necessário
    }
  };

  // Função para reproduzir som de sucesso/erro (usando Howler.js)
  const playSound = (type) => {
    let sound;
    if (type === 'success') {
      sound = new Howl({ src: ['/sounds/success.mp3'] }); // Crie este arquivo
    } else if (type === 'error') {
      sound = new Howl({ src: ['/sounds/error.mp3'] }); // Crie este arquivo
    }
    if (sound) {
      sound.play();
    }
  };

  const handleDropLetter = (letter) => {
    setDroppedLetters((prev) => [...prev, letter]);
    setAvailableLetters((prev) => prev.filter((l) => l !== letter));
  };

  const handleOperatorClick = (operator) => {
    if (operator === '+') {
      // Agrega as letras para formar a palavra
      const formedWord = droppedLetters.join('');
      setCurrentWord(formedWord);
      speak(formedWord); // Lê a palavra formada
      setFeedback(null); // Limpa feedback anterior
    } else if (operator === '-') {
      // Desmembra a palavra de volta em letras
      setAvailableLetters((prev) => [...prev, ...droppedLetters]);
      setDroppedLetters([]);
      setCurrentWord('');
      setFeedback(null);
    } else if (operator === '=') {
      // Verifica a palavra formada
      if (currentWord.toUpperCase() === targetWord.toUpperCase()) {
        setFeedback({ message: 'Parabéns! Você acertou!', isCorrect: true });
        playSound('success');
        // Lógica para avançar para a próxima atividade ou registrar progresso
      } else {
        setFeedback({ message: 'Tente novamente. A palavra correta é ' + targetWord, isCorrect: false });
        playSound('error');
        speak(targetWord); // Lê a palavra correta
      }
    }
  };

  const handleReset = () => {
    setAvailableLetters(['C', 'A', 'S', 'A']);
    setDroppedLetters([]);
    setCurrentWord('');
    setFeedback(null);
  };

  useEffect(() => {
    // Você pode pré-carregar sons aqui se quiser
    // new Howl({ src: ['/sounds/success.mp3'] }).load();
    // new Howl({ src: ['/sounds/error.mp3'] }).load();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <ActivityContainer>
        <ActivityBox>
          <Instruction>Arraste as letras para formar a palavra e use os operadores!</Instruction>

          <LettersContainer>
            {availableLetters.map((letter, index) => (
              <DraggableLetter key={index} letter={letter} />
            ))}
          </LettersContainer>

          <DropTargetArea onDropLetter={handleDropLetter}>
            <WordDisplay word={currentWord || droppedLetters.join('')} />
          </DropTargetArea>

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
