interface ToastLinkProps {
  message: string;
  href: string;
  linkLabel?: string;
  tone?: 'primary' | 'danger';
}

export function ToastLink({
  message,
  href,
  linkLabel = 'Ver detalhes',
  tone = 'primary'
}: ToastLinkProps) {
  return (
    <span className="toast-link">
      {message}
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        data-tone={tone}
      >
        {linkLabel}
      </a>
    </span>
  );
}
