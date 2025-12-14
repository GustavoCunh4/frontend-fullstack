import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { toastWithLink } from '../../utils/toast';
import { getErrorMessage } from '../../utils/error';

const initialForm = {
  email: '',
  password: ''
};

export default function LoginPage() {
  const { login, isAuthenticated, initializing } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const rememberedEmail = (location.state as any)?.email;
    if (rememberedEmail) {
      setForm(prev => ({ ...prev, email: rememberedEmail }));
    }
  }, [location.state]);

  if (initializing) {
    return <LoadingOverlay fullScreen message="Carregando sessao..." />;
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      toastWithLink('success', 'Login realizado com sucesso!', 'Abrir backend');
      const redirectTo =
        (location.state as any)?.from?.pathname ?? '/dashboard';
      navigate(redirectTo, { replace: true });
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
          <h1>Acesse suas tarefas</h1>
          <p>
            Informe suas credenciais para desbloquear o dashboard protegido por
            JWT.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>E-mail</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
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
              autoComplete="current-password"
              required
              minLength={6}
            />
          </label>

          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-hint">
          Ainda nao possui conta? <Link to="/register">Crie agora mesmo.</Link>
        </p>
      </section>

      <aside className="auth-hero">
        <h2>Mini Projeto - Controle de Tarefas</h2>
        <p>
          Fluxo completo com registro, login, controle de sessao via JWT e CRUD
          de tarefas totalmente protegido. Todo o estado fica sincronizado com o
          backend real usando Fetch API (funciona tanto com MongoDB quanto com
          PostgreSQL).
        </p>
        <ul>
          <li>Armazenamento do token via LocalStorage</li>
          <li>Interceptacao de 401 para redirecionar ao login</li>
          <li>Toasts com links para acompanhar deploys</li>
        </ul>
      </aside>
    </div>
  );
}
