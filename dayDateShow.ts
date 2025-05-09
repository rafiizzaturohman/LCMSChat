const schedule: number = Date.now();

const options: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const formattedDate: string = new Date(schedule).toLocaleDateString('id-ID', options);

console.log(formattedDate);
