export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function toStr(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function dayIndex(startDate) {
  const start = new Date(startDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today - start) / 86400000);
}

export function addDays(startDateStr, offset) {
  const d = new Date(startDateStr + 'T00:00:00');
  d.setDate(d.getDate() + offset);
  return d;
}

function pad(n) {
  return String(n).padStart(2, '0');
}
