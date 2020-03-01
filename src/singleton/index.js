export const user = (() => {
  let instance;

  return {
    setInstance: (user) => {
      instance = user;
    },
    getInstance: () => instance,
  };
})();
