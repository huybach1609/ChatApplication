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

export const guidGenerator=()=> {
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}