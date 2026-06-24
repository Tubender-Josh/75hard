// Pre-populated from existing web app data (screenshot taken June 24, 2026)
// Partial days: first N tasks set to true since we don't know which specific ones

function missed() {
  return { tasks: [false, false, false, false, false, false, false], photo: null };
}

function partial(n) {
  return { tasks: Array(7).fill(false).map((_, i) => i < n), photo: null };
}

function complete() {
  return { tasks: [true, true, true, true, true, true, true], photo: null };
}

export const MIGRATION_DATA = {
  startDate: '2026-05-13',
  days: {
    '2026-05-13': partial(4),
    '2026-05-14': missed(),
    '2026-05-15': missed(),
    '2026-05-16': partial(2),
    '2026-05-17': partial(2),
    '2026-05-18': missed(),
    '2026-05-19': missed(),
    '2026-05-20': missed(),
    '2026-05-21': missed(),
    '2026-05-22': partial(3),
    '2026-05-23': missed(),
    '2026-05-24': missed(),
    '2026-05-25': missed(),
    '2026-05-26': partial(2),
    '2026-05-27': missed(),
    '2026-05-28': missed(),
    '2026-05-29': partial(1),
    '2026-05-30': missed(),
    '2026-05-31': missed(),
    '2026-06-01': partial(1),
    '2026-06-02': missed(),
    '2026-06-03': missed(),
    '2026-06-04': missed(),
    '2026-06-05': missed(),
    '2026-06-06': missed(),
    '2026-06-07': partial(1),
    '2026-06-08': missed(),
    '2026-06-09': missed(),
    '2026-06-10': partial(1),
    '2026-06-11': missed(),
    '2026-06-12': missed(),
    '2026-06-13': missed(),
    '2026-06-14': missed(),
    '2026-06-15': partial(4),
    '2026-06-16': complete(),
    '2026-06-17': complete(),
    '2026-06-18': complete(),
    '2026-06-19': partial(3),
    '2026-06-20': partial(4),
    '2026-06-21': complete(),
    '2026-06-22': partial(2),
    '2026-06-23': partial(3),
  },
};
