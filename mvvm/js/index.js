function SelfVue(data, el, exp) {
  var self = this;
  this.data = data;

  Object.keys(data).forEach((key) => {
    self.proxyKeys(key);
  });

  observe(data);
  /**
   * 初始化模版的值
   */
  el.innerHTML = this.data[exp];
  new Watcher(this, exp, function (value) {
    el.innerHTML = value;
  });

  return this;
}

SelfVue.prototype = {
  proxyKeys: function (key) {
    var self = this;
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: true,
      get: function proxyGetter() {
        return self.data[key];
      },
      set: function proxySetter(newVal) {
        self.data[key] = newVal;
      },
    });
  },
};
