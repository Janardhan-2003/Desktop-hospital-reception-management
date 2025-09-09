export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB');
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-GB');
};

export const getTodayString = () => {
  return new Date().toDateString();
};

export const getWeekStart = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = today.getDate() - dayOfWeek;
  return new Date(today.setDate(diff));
};

export const getMonthStart = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
};

export const isToday = (date) => {
  return new Date(date).toDateString() === getTodayString();
};

export const isThisWeek = (date) => {
  const weekStart = getWeekStart();
  return new Date(date) >= weekStart;
};

export const isThisMonth = (date) => {
  const monthStart = getMonthStart();
  return new Date(date) >= monthStart;
};

export const getDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const formatDateForInput = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const getCurrentDateTime = () => {
  return new Date().toISOString();
};