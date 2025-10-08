import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Digite um nome.');
      return;
    }
    setLoading(true);
    setError('');

    const result = await register(name.trim());
    if (result.success) {
      alert(`Bem-vindo, ${result.user.name}! Você foi cadastrado com sucesso.`); 
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const suggestions = ['Pedro', 'Ana', 'Lucas', 'Sofia', 'Professor João'];

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
      <h1 style={{ color: '#28a745', marginBottom: '30px' }}>Cadastre-se!</h1>
      <p>Digite seu nome para se cadastrar:</p>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex.: Pedro ou Ana"
          autoComplete="off"
          list="name-suggestions"
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
        <datalist id="name-suggestions">
          {suggestions.map((sug, index) => <option key={index} value={sug} />)}
        </datalist>

        {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading || !name.trim()}
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
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
        Já tem nome cadastrado? Faça login aqui.
      </Link>
    </div>
  );
};

export default RegisterPage;