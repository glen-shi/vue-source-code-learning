let activeEffect = undefined;

export const cleanUpEffect = (effect) => {
  effect.deps.forEach((item) => {
    item.delete(effect);
  });
  effect.deps.length = 0;
};

export class ActiveEffect {
  constructor(private fn, public scheduler) {}
  parent = undefined;
  deps = [];
  isActive = true
  run() {
    if(!this.isActive) {
      return this.fn();
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      cleanUpEffect(this);
      return this.fn();
    } finally {
      activeEffect = this.parent;
      // 这里还是不知道为啥要把this.parent置空
      this.parent = undefined;
    }
  }
  stop() {
    this.isActive = false
    cleanUpEffect(this)
  }
}

export const effect = (fn, options: any = {}) => {
  const _effect = new ActiveEffect(fn, options.scheduler);
  _effect.run();
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
};

const targetMap = new WeakMap();
// weakmap map set


export const track = (target, key) => {
  if (activeEffect) {
    // debugger;
    let keyMap = targetMap.get(target);
    if (!keyMap) targetMap.set(target, keyMap = new Map());

    let effectSet = keyMap.get(key);
    if (!effectSet) keyMap.set(key, effectSet = new Set());

    if (!effectSet.has(activeEffect)) {
      effectSet.add(activeEffect);
      activeEffect.deps.push(effectSet);
    }
  }
};

export const trigger = (target, key) => {
  const keyMap = targetMap.get(target);
  if (!keyMap) return;
  const effectSet = keyMap.get(key);
  if (!effectSet) return;
  const effectList = [...effectSet];

  effectList.forEach((i) => {
    // 正在执行的不要多次执行
    if (activeEffect !== i) {
      if(i.scheduler) {
        i.scheduler()
      }else {
        i.run();
      }
    }
  });
};
