import toast from 'react-hot-toast';
import type { ToastOptions } from 'react-hot-toast';
import { ToastLink } from '../components/ToastLink';
import { EXTERNAL_HELP_URL } from '../config';

type ToastType = 'success' | 'error' | 'message';

const defaultOptions: ToastOptions = {
  duration: 4500
};

export function toastWithLink(
  type: ToastType,
  message: string,
  linkLabel?: string,
  href: string = EXTERNAL_HELP_URL,
  options?: ToastOptions
) {
  const content = (
    <ToastLink
      message={message}
      href={href}
      linkLabel={linkLabel}
      tone={type === 'error' ? 'danger' : 'primary'}
    />
  );

  if (type === 'error') {
    toast.error(content, { ...defaultOptions, ...options });
    return;
  }

  if (type === 'success') {
    toast.success(content, { ...defaultOptions, ...options });
    return;
  }

  toast(content, { ...defaultOptions, ...options });
}
