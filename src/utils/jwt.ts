export function decodeExpiration(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (typeof payload.exp === 'number') {
      return payload.exp * 1000;
    }
  } catch {
    // noop - token invalido ou sem exp
  }
  return null;
}
