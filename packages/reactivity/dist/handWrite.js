export function debounce(fn, time) {
  let timer;
  return function (...args) {
    const context = this;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.call(context, ...args);
      timer = null;
    }, time);
  };
}

export function throttle(fn, time) {
  let timer;
  return function (...args) {
    if(timer) return
    timer = setTimeout(()=> {
      fn.call(undefined,...args)
      timer = null;
    }, time)
  }
}
