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

  compileElement() {
    
  },
};
