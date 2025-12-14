import clsx from 'clsx';
import { EXTERNAL_STATUS_URL } from '../config';

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md';
}

export function LoadingOverlay({
  message = 'Carregando...',
  fullScreen = false,
  size = 'md'
}: LoadingOverlayProps) {
  return (
    <div
      className={clsx('loading-overlay', {
        fullscreen: fullScreen,
        small: size === 'sm'
      })}
      role="status"
    >
      <span className="spinner" aria-hidden />
      <div className="loading-copy">
        <p>{message}</p>
        <a href={EXTERNAL_STATUS_URL} target="_blank" rel="noreferrer">
          Ver status do backend
        </a>
      </div>
    </div>
  );
}
