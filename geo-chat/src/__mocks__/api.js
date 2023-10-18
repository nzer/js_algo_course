export const getAllMessagesApi = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          userName: "Bizhan",
          message: "Test Message One",
          time: new Date().toISOString(),
        },
        {
          id: 2,
          userName: "Tair",
          message: "Test Message Two",
          time: new Date().toISOString(),
        },
      ]);
    }, 2000);
  });
};

export const setUserMessage = ({ message, userName }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now(),
        userName,
        message,
        time: new Date().toISOString(),
      });
    }, 2000);
  });
};
