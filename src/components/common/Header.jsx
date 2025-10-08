import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
`;

const Nav = styled.nav`
  ul {
    list-style: none;
    display: flex;
    gap: 1.5rem;
  }

  li a {
    color: white;
    font-size: 1.1rem;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Header = () => {
  const userName = "João Paulo";
  const userRole = "student";

  return (
    <HeaderContainer>
      <Logo to="/dashboard">Alfabetizacao</Logo>
      <Nav>
        <ul>
          {userRole === 'student' && (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/activity/syllable-formation">Atividades</Link></li>
              <li><Link to="/activity/alphabet-explorer">Explorar Alfabeto</Link></li>
              <li><Link to="/progress">Progresso</Link></li>
            </>
          )}
          {userRole === 'admin' && (
            <>
              <li><Link to="/dashboard">Admin Dashboard</Link></li>
              <li><Link to="/admin/content">Gerenciar Conteúdo</Link></li>
              <li><Link to="/admin/users">Gerenciar Usuários</Link></li>
            </>
          )}
          <li>Olá, {userName}!</li>
          <li><Link to="/login">Sair</Link></li>
        </ul>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
