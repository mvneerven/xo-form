export const EventBus = () => {
  let _bus = document.createElement("div");
  const _register = (event, callback) => {
    _bus.addEventListener(event, callback);
  };
  const _remove = (event, callback) => {
    _bus.removeEventListener(event, callback);
  };
  const _fire = (event, detail = {}) => {
    _bus.dispatchEvent(new CustomEvent(event, { detail }));
  };
  return {
    register: _register,
    remove: _remove,
    fire: _fire,
  };
};

window.eventBus = EventBus();
