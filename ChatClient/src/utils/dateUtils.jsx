export const toHour = (timestamp) => {
    var hours = timestamp.getHours();
    var minutes = timestamp.getMinutes();
    var minutesString =  minutes < 10 ? "0" + minutes : minutes;

    return hours + ":" + minutesString;
}
export const groupMessagesByDate = (messages) => {
  return messages.reduce((acc, message) => {
    const date = new Date(message.time).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);

    return acc;
  }, {});
};
