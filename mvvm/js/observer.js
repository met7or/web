/**
 * Object.defineProperty()
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
 */

// 监听器Observer，用来监听并劫持所有属性，如果有变动，就通知订阅者
function Observer(data) {
  this.data = data;
  // 劫持属性
  this.walk(data);
}

function observe(value) {
  if (!value || typeof value !== "object") {
    return;
  }

  return new Observer(value);
}

// 订阅起Dep主要负责收集订阅者，然后在属性变化的时候执行对应订阅者的更新函数
function Dep() {
  this.subs = [];
}

Dep.prototype = {
  addSub: function (sub) {
    this.subs.push(sub);
  },

  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update();
    });
  },
};

Dep.target = null;

Observer.prototype = {
  walk: function (data) {
    var self = this;
    Object.keys(data).forEach(function (key) {
      self.defineReactive(data, key, data[key]);
    });
  },

  defineReactive: function (data, key, val) {
    var dep = new Dep();
    var childObj = observe(val);

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      /**
       * 在get方法中执行添加订阅者的操作
       * 只有在订阅者Watcher初始化的时候才需要添加
       * 所以通过在Dep.target上缓存下订阅者，添加成功后在去掉就可以了
       */
      get: function () {
        if (Dep.target) {
          dep.addSub(Dep.target);
        }

        return val;
      },

      set: function (newVal) {
        // 如果和旧值相等，不做任何处理
        if (newVal === val) {
          return;
        }

        val = newVal;
        dep.notify();
      },
    });
  },
};
