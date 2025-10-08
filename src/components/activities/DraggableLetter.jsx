import React from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';

const LetterBox = styled.div`
  width: 60px;
  height: 60px;
  background-color: var(--secondary-color);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: grab;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  opacity: ${(props) => (props.isDragging ? 0.5 : 1)};
  transition: opacity 0.2s ease;
`;

const DraggableLetter = ({ letter }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'letter',
    item: { letter },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <LetterBox ref={drag} isDragging={isDragging}>
      {letter}
    </LetterBox>
  );
};

export default DraggableLetter;
