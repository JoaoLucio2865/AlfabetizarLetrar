import { useState } from 'react';
import { Link } from 'react-router-dom';  // Removido useNavigate, pois redirecionamento é no contexto
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Função para síntese de voz (para acessibilidade)
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Digite seu nome.');
      speak('Digite seu nome.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await login(username.trim());  // Chama login do contexto (redireciona automaticamente)
      speak(`Bem-vindo, ${username.trim()}!`);  // Feedback de voz
    } catch (err) {
      setError('Erro no login. Verifique sua conexão.');
      speak('Erro no login.');
    } finally {
      setLoading(false);
    }
  };

  const suggestions = ['João', 'Maria', 'Pedro', 'Professora Ana', 'Aluno Teste'];

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '30px', 
      border: '1px solid #ddd', 
      borderRadius: '10px', 
      textAlign: 'center',
      fontSize: '18px'
    }}>
      <h1 style={{ color: '#007bff', marginBottom: '30px' }}>Bem-vindo!</h1>
      <p>Digite seu nome para entrar:</p>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ex.: João ou Professora Maria"
          autoComplete="off"
          list="username-suggestions"
          style={{ 
            width: '100%', 
            padding: '15px', 
            fontSize: '20px', 
            border: '2px solid #ddd', 
            borderRadius: '5px', 
            marginBottom: '15px',
            textAlign: 'center'
          }}
          disabled={loading}
        />
        <datalist id="username-suggestions">
          {suggestions.map((sug, index) => <option key={index} value={sug} />)}
        </datalist>

        {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading || !username.trim()}
          style={{
            width: '100%',
            padding: '15px',
            background: '#28a745',
            color: 'white',
            fontSize: '18px',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
        Ainda não tem nome cadastrado? Cadastre-se aqui.
      </Link>
    </div>
  );
};

export default LoginPage;