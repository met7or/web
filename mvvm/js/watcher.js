// 实现订阅者watcher, 可以收到属性的变化通知并执行相应的函数, 从而更新相应的试图
function Watcher(vm, exp, cb) {
  this.vm = vm;
  this.exp = exp;
  this.cb = cb;
  this.value = this.get();
}

Watcher.prototype = {
  update: function () {
    this.run();
  },

  run: function () {
    var value = this.vm.data[this.exp];
    var oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.cb.call(this.vm, value, oldVal);
    }
  },

  get: function () {
    Dep.target = this;
    var value = this.vm.data[this.exp];
    Dep.target = null;
    return value;
  },
};
