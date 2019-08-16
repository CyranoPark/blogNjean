export function changeDateFormat(date, format) {
  const targetDate = new Date(date);
  if (format) {
    return (
      `${new Date(targetDate).getFullYear()}년
      ${new Date(targetDate).getMonth() + 1}월
      ${new Date(targetDate).getDate()}일
      ${new Date(targetDate).getHours()}시
      ${new Date(targetDate).getMinutes()}분
      ${new Date(targetDate).getSeconds()}초`
    );
  }
  return (
    `${new Date(targetDate).getFullYear()}년
    ${new Date(targetDate).getMonth() + 1}월
    ${new Date(targetDate).getDate()}일`
  );
}

export function changeTitleFormat(title) {
  return title.replace('?', '_');
}
