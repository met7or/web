/**
 *
 * @param {*} el
 * @param {*} vm
 */
function Compile(el, vm) {
  this.vm = vm;
  this.el = document.querySelector(el);
  this.fragment = null;
  this.init();
}

Compile.prototype = {
  init: function () {
    if (this.el) {
      this.fragment = this.nodeToFragment(this.el);
      this.compileElement(this.fragment);
      this.el.appendChild(this.fragment);
    } else { 
      console.log('Dom元素不存在')
    }
  },

  /**
   * 为了解析模版，首先需要获取到dom元素，然后进行处理，此处dom元素操作频繁
   * 所以可以先建一个fragment片段，将需要解析的dom节点存入fragment片段里再进行处理
   * @param {*} el
   */
  nodeToFragment: function (el) {
    // 创建新的空白的文档片段
    var fragment = document.createDocumentFragment();
    var child = el.firstChild;
    while (child) {
      fragment.appendChild(child);
      child = el.firstChild;
    }

    return fragment;
  },

  compileElement(el) {
    var childNodes = el.childNodes;
    var self = this;

    [].slice.call(childNodes).forEach(function (node) {
      var reg = /\{\{(.*)\}\}/;
      var text = node.textContent;

      if (self.isElementNode(node)) {
        self.compile(node);
      } else if (self.isTextNode(node) && reg.test(text)) {
        self.compileText(node, reg.exec(text)[1]);
      }

      if (node.childNodes && node.childNodes.length) {
        self.compileElement(node);
      }
    });
  },

  /**
   * nodeType属性以数字值返回指定节点的节点类型
   * 1: 元素节点
   * 2: 属性节点
   * 3: 文本节点
   * @param {*} node
   */
  isElementNode: function (node) {
    return node.nodeType == 1;
  },

  isTextNode: function (node) {
    return node.nodeType === 3;
  },

  compile: function (node) {
    // 获取节点的属性集合
    var nodeAttrs = node.attributes;
    var self = this;

    Array.prototype.forEach.call(nodeAttrs, function (attr) {
      var attrName = attr.name;
      if (self.isDirective(attrName)) {
        var exp = attr.value;
        var dir = attrName.substring(2);

        if (self.isEventDirective(dir)) {
          // 事件指令 v-on
          self.compileEvent(node, self.vm, exp, dir);
        } else {
          // v-model 指令
          self.compileModel(node, self.vm, exp, dir);
        }

        node.removeAttribute(attrName);
      }
    });
  },

  isDirective: function (attr) {
    return attr.indexOf("v-") === 0;
  },

  isEventDirective: function (dir) {
    return dir.indexOf("on:") === 0;
  },

  /**
   *
   * @param {*} node 节点
   * @param {*} vm SelfVue实例
   * @param {*} exp 属性值
   * @param {*} dir  on:属性名
   */
  compileEvent: function (node, vm, exp, dir) {
    var eventType = dir.split(":")[1];
    var cb = vm.methods && vm.methods[exp];

    if (eventType && cb) {
      // 使用bind方法将cb函数的this指向SelfVue实例中
      node.addEventListener(eventType, cb.bind(vm), false);
    }
  },

  compileModel: function (node, vm, exp, dir) {
    /**
     * index.js设置了代理 可以直接访问this.vm[exp]
     */
    var self = this;
    var val = this.vm[exp];
    this.modelUpdater(node, val);

    // TODO
    new Watcher(this.vm, exp, function (value) {
      self.modelUpdater(node, value);
    });

    // 添加输入框监听事件
    node.addEventListener("input", function (e) {
      var newVal = e.target.value;
      if (val === newVal) {
        return;
      }

      self.vm[exp] = newVal;
      val = newVal;
    });
  },

  modelUpdater: function (node, value) {
    node.value = typeof value === "undefined" ? "" : value;
  },

  compileText: function (node, exp) {
    var self = this;
    var initText = this.vm[exp];

    this.updateText(node, initText);
    new Watcher(this.vm, exp, function (value) {
      self.updateText(node, value);
    });
  },

  updateText: function (node, value) {
    node.textContent = typeof value == "undefined" ? "" : value;
  },
};
