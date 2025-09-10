export const getUserStats = () => {
  const registered = localStorage.getItem('totalRegisteredUsers') || '1';
  const online = localStorage.getItem('currentOnlineUsers') || '1';
  
  return {
    registered: parseInt(registered),
    online: parseInt(online)
  };
};

export const updateUserStats = (registered?: number, online?: number) => {
  if (registered !== undefined) {
    localStorage.setItem('totalRegisteredUsers', registered.toString());
  }
  if (online !== undefined) {
    localStorage.setItem('currentOnlineUsers', online.toString());
  }
};

export const incrementRegisteredUsers = () => {
  const current = getUserStats();
  updateUserStats(current.registered + 1);
  return current.registered + 1;
};

export const setOnlineUsers = (count: number) => {
  updateUserStats(undefined, count);
  return count;
};

export const simulateOnlineActivity = () => {
  const stats = getUserStats();
  const maxOnline = Math.min(stats.registered, Math.max(1, Math.floor(stats.registered * 0.1)));
  const variation = Math.floor(Math.random() * Math.max(1, maxOnline * 0.3));
  const baseOnline = Math.max(1, Math.floor(maxOnline * 0.7));
  const currentOnline = baseOnline + variation;
  
  setOnlineUsers(currentOnline);
  return currentOnline;
};