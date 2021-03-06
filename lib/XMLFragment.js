(function() {
  var XMLFragment;
  var __hasProp = Object.prototype.hasOwnProperty;
  XMLFragment = (function() {
    function XMLFragment(parent, name, attributes, text) {
      this.parent = parent;
      this.name = name;
      this.attributes = attributes;
      this.value = text;
      this.children = [];
    }
    XMLFragment.prototype.element = function(name, attributes, text) {
      var child, key, val, _ref, _ref2;
      if (!(name != null)) {
        throw new Error("Missing element name");
      }
      name = '' + name || '';
      this.assertLegalChar(name);
      attributes != null ? attributes : attributes = {};
      if (this.is(attributes, 'String') && this.is(text, 'Object')) {
        _ref = [text, attributes], attributes = _ref[0], text = _ref[1];
      } else if (this.is(attributes, 'String')) {
        _ref2 = [{}, attribues], attributes = _ref2[0], text = _ref2[1];
      }
      for (key in attributes) {
        if (!__hasProp.call(attributes, key)) continue;
        val = attributes[key];
        val = '' + val || '';
        attributes[key] = this.escape(val);
      }
      child = new XMLFragment(this, name, attributes);
      if (text != null) {
        text = '' + text || '';
        text = this.escape(text);
        this.assertLegalChar(text);
        child.text(text);
      }
      this.children.push(child);
      return child;
    };
    XMLFragment.prototype.text = function(value) {
      var child;
      if (!(value != null)) {
        throw new Error("Missing element text");
      }
      value = '' + value || '';
      value = this.escape(value);
      this.assertLegalChar(value);
      child = new XMLFragment(this, '', {}, value);
      this.children.push(child);
      return this;
    };
    XMLFragment.prototype.cdata = function(value) {
      var child;
      if (!(value != null)) {
        throw new Error("Missing CDATA text");
      }
      value = '' + value || '';
      this.assertLegalChar(value);
      if (value.match(/]]>/)) {
        throw new Error("Invalid CDATA text: " + value);
      }
      child = new XMLFragment(this, '', {}, '<![CDATA[' + value + ']]>');
      this.children.push(child);
      return this;
    };
    XMLFragment.prototype.comment = function(value) {
      var child;
      if (!(value != null)) {
        throw new Error("Missing comment text");
      }
      value = '' + value || '';
      value = this.escape(value);
      this.assertLegalChar(value);
      if (value.match(/--/)) {
        throw new Error("Comment text cannot contain double-hypen: " + value);
      }
      child = new XMLFragment(this, '', {}, '<!-- ' + value + ' -->');
      this.children.push(child);
      return this;
    };
    XMLFragment.prototype.raw = function(value) {
      var child;
      if (!(value != null)) {
        throw new Error("Missing raw text");
      }
      value = '' + value || '';
      child = new XMLFragment(this, '', {}, value);
      this.children.push(child);
      return this;
    };
    XMLFragment.prototype.up = function() {
      if (!(this.parent != null)) {
        throw new Error("This node has no parent");
      }
      return this.parent;
    };
    XMLFragment.prototype.attribute = function(name, value) {
      var _ref;
      if (!(name != null)) {
        throw new Error("Missing attribute name");
      }
      if (!(value != null)) {
        throw new Error("Missing attribute value");
      }
      name = '' + name || '';
      value = '' + value || '';
      (_ref = this.attributes) != null ? _ref : this.attributes = {};
      this.attributes[name] = this.escape(value);
      return this;
    };
    XMLFragment.prototype.toString = function(options, level) {
      var attName, attValue, child, indent, newline, pretty, r, space, _i, _len, _ref, _ref2;
      pretty = (options != null) && options.pretty || false;
      indent = (options != null) && options.indent || '  ';
      newline = (options != null) && options.newline || '\n';
      level || (level = 0);
      space = new Array(level + 1).join(indent);
      r = '';
      if (pretty) {
        r += space;
      }
      if (!this.value) {
        r += '<' + this.name;
      } else {
        r += '' + this.value;
      }
      _ref = this.attributes;
      for (attName in _ref) {
        attValue = _ref[attName];
        if (this.name === '!DOCTYPE') {
          r += ' ' + attValue;
        } else {
          r += ' ' + attName + '="' + attValue + '"';
        }
      }
      if (this.children.length === 0) {
        if (!this.value) {
          r += this.name === '?xml' ? '?>' : this.name === '!DOCTYPE' ? '>' : '/>';
        }
        if (pretty) {
          r += newline;
        }
      } else {
        r += '>';
        if (pretty) {
          r += newline;
        }
        _ref2 = this.children;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          child = _ref2[_i];
          r += child.toString(options, level + 1);
        }
        if (pretty) {
          r += space;
        }
        r += '</' + this.name + '>';
        if (pretty) {
          r += newline;
        }
      }
      return r;
    };
    XMLFragment.prototype.escape = function(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;');
    };
    XMLFragment.prototype.assertLegalChar = function(str) {
      var chars, chr;
      chars = /[\u0000-\u0008\u000B-\u000C\u000E-\u001F\uD800-\uDFFF\uFFFE-\uFFFF]/;
      chr = str.match(chars);
      if (chr) {
        throw new Error("Invalid character (" + chr + ") in string: " + str);
      }
    };
    XMLFragment.prototype.is = function(obj, type) {
      var clas;
      clas = Object.prototype.toString.call(obj).slice(8, -1);
      return (obj != null) && clas === type;
    };
    XMLFragment.prototype.ele = function(name, attributes, text) {
      return this.element(name, attributes, text);
    };
    XMLFragment.prototype.txt = function(value) {
      return this.text(value);
    };
    XMLFragment.prototype.dat = function(value) {
      return this.cdata(value);
    };
    XMLFragment.prototype.att = function(name, value) {
      return this.attribute(name, value);
    };
    XMLFragment.prototype.com = function(value) {
      return this.comment(value);
    };
    XMLFragment.prototype.e = function(name, attributes, text) {
      return this.element(name, attributes, text);
    };
    XMLFragment.prototype.t = function(value) {
      return this.text(value);
    };
    XMLFragment.prototype.d = function(value) {
      return this.cdata(value);
    };
    XMLFragment.prototype.a = function(name, value) {
      return this.attribute(name, value);
    };
    XMLFragment.prototype.c = function(value) {
      return this.comment(value);
    };
    XMLFragment.prototype.r = function(value) {
      return this.raw(value);
    };
    XMLFragment.prototype.u = function() {
      return this.up;
    };
    return XMLFragment;
  })();
  module.exports = XMLFragment;
}).call(this);
