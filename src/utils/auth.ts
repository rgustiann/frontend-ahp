export function getUserFromLocalStorage() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function checkRole(allowedRoles: string[]): boolean {
  const user = getUserFromLocalStorage();
  return user && allowedRoles.includes(user.role);
}
