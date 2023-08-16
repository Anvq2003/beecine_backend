const bindController = (controller, method) => {
  return controller[method].bind(controller);
};

module.exports = bindController;
