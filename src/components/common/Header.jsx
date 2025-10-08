import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 

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

  li button {  // Estilo para o botão de logout (opcional, para diferenciar do link)
    background: none;
    border: none;
    color: white;
    font-size: 1.1rem;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userName = user?.name || 'Usuário'; 
  const userRole = user?.role || 'student';  // Fallback para student

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <HeaderContainer>
      <Logo to="/dashboard">Alfabetizacao</Logo>
      <Nav>
        <ul>
          {userRole === 'student' && (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/upcoming-activities">Atividades</Link></li>  {/* Atualizado: Para novas atividades */}
              <li><Link to="/activity/alphabet-explorer">Explorar Alfabeto</Link></li>
              <li><Link to="/progress">Progresso</Link></li>
            </>
          )}
          {userRole === 'admin' && (
            <>
              <li><Link to="/dashboard">Admin Dashboard</Link></li>
              <li><Link to="/create-activity">Criar Atividade</Link></li>  {/* Exemplo: Para criação de atividades */}
              <li><Link to="/admin/users">Gerenciar Usuários</Link></li>
            </>
          )}
          <li>Olá, {userName}!</li>
          <li><button onClick={handleLogout}>Sair</button></li>  {/* ← Mudança: Botão com logout real */}
        </ul>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;