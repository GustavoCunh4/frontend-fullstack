import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerRequest } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { toastWithLink } from '../../utils/toast';
import { getErrorMessage } from '../../utils/error';

const initialForm = {
  name: '',
  email: '',
  password: ''
};

export default function RegisterPage() {
  const { isAuthenticated, initializing } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (initializing) {
    return <LoadingOverlay fullScreen message="Preparando formulário..." />;
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await registerRequest(form);
      toastWithLink(
        'success',
        'Cadastro realizado! Você já pode fazer login.',
        'Abrir documentação'
      );
      navigate('/login', { state: { email: form.email }, replace: true });
    } catch (error) {
      toastWithLink('error', getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-panel">
        <header>
          <h1>Crie sua conta</h1>
          <p>
            Informe seus dados para gerar um usuário e testar o fluxo completo
            com PostgreSQL e JWT.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Nome</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
            />
          </label>

          <label>
            <span>E-mail</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>Senha</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </label>

          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? 'Enviando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="auth-hint">
          Já tem conta? <Link to="/login">Faça login.</Link>
        </p>
      </section>

      <aside className="auth-hero">
        <h2>Por que criar agora?</h2>
        <p>
          Ter um usuário próprio facilita a visualização do CRUD de tarefas,
          já que cada token só enxerga os dados do dono.
        </p>
        <ul>
          <li>Senha criptografada com bcrypt</li>
          <li>Email normalizado e validado via backend</li>
          <li>Resposta com mensagens amigáveis</li>
        </ul>
      </aside>
    </div>
  );
}
