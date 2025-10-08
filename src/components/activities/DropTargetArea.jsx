import React from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';

const DropArea = styled.div`
  min-height: 100px;
  border: 2px dashed ${(props) => (props.isOver ? 'var(--primary-color)' : '#ccc')};
  background-color: ${(props) => (props.isOver ? '#e0ffe0' : '#f9f9f9')};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #888;
  padding: 1rem;
  transition: all 0.2s ease;
`;

const DropTargetArea = ({ children, onDropLetter }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'letter',
    drop: (item) => onDropLetter(item.letter),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <DropArea ref={drop} isOver={isOver}>
      {children}
    </DropArea>
  );
};

export default DropTargetArea;
