(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "react"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("react"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react);
    global.index = mod.exports;
  }
})(this, function (exports, _react) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var SmartSearch = function (_React$Component) {
    _inherits(SmartSearch, _React$Component);

    function SmartSearch(props) {
      _classCallCheck(this, SmartSearch);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SmartSearch).call(this, props));

      _this.state = {
        selected: []
      };
      _this.selectItem = _this.selectItem.bind(_this);
      return _this;
    }

    _createClass(SmartSearch, [{
      key: "selectItem",
      value: function selectItem(item) {
        this.setState({
          selected: this.state.selected.concat([item])
        });
        this.props.onSelect(item);
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        return _react2.default.createElement(
          "div",
          null,
          this.state.selected.map(function (item) {
            return _react2.default.createElement(
              "div",
              { key: item.id, onClick: function onClick() {
                  _this2.selectItem(item);
                } },
              _this2.props.renderSelected(item)
            );
          }),
          "Search",
          this.props.results.map(function (results) {
            return _react2.default.createElement(
              "div",
              { className: "results-list", key: results.key },
              _react2.default.createElement(
                "h3",
                null,
                results.label
              ),
              results.items.map(function (result) {
                return _react2.default.createElement(
                  "div",
                  { key: result.id, onClick: function onClick() {
                      _this2.selectItem(result);
                    } },
                  _this2.props.renderItem(result)
                );
              })
            );
          })
        );
      }
    }]);

    return SmartSearch;
  }(_react2.default.Component);

  exports.default = SmartSearch;
});