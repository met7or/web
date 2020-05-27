/**
 * 实现订阅者watcher, 可以收到属性的变化通知并执行相应的函数, 从而更新相应的试图
 * @param {*} vm SelfVue实例
 * @param {*} exp 属性名
 * @param {*} cb 
 */
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
    var value = this.vm.data[this.exp]; // 强制执行监听器里的get函数,将自己添加到dep中
    Dep.target = null;
    return value;
  },
};
