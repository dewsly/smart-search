(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react);
    global.index = mod.exports;
  }
})(this, function (exports, _react) {
  'use strict';

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

      var _this = _possibleConstructorReturn(this, (SmartSearch.__proto__ || Object.getPrototypeOf(SmartSearch)).call(this, props));

      /**
       * @type {object}
       * @property {array} selected array of selected items
       */
      _this.state = {
        selected: []
      };
      _this._selectItem = _this._selectItem.bind(_this);
      _this._removeItem = _this._removeItem.bind(_this);
      return _this;
    }

    _createClass(SmartSearch, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (nextProps.query !== this.props.query) {
          this._onQueryChange(nextProps.query);
        }
      }
    }, {
      key: '_getResults',
      value: function _getResults() {
        return this.props.results;
      }
    }, {
      key: '_handleChange',
      value: function _handleChange(event) {
        this._onQueryChange(event.target.value);
      }
    }, {
      key: '_onQueryChange',
      value: function _onQueryChange(query) {
        // determine if query value length is >= props.minCharacters
        if (!query || query.length < this.props.minCharacters) {
          return;
        }

        // execute search action with search value:
        if (this.props.search) {
          this.props.search(query);
        }
      }
    }, {
      key: '_removeItem',
      value: function _removeItem(item) {
        this.setState({
          selected: this.state.selected.filter(function (val) {
            return val.id !== item.id;
          })
        });
        if (this.props.onRemove) {
          this.props.onRemove(item, this.state.selected);
        }
      }
    }, {
      key: '_renderItem',
      value: function _renderItem(item) {
        return this.props.renderItem ? this.props.renderItem(item) : JSON.stringify(item);
      }
    }, {
      key: '_renderLabel',
      value: function _renderLabel() {
        return this.props.label || 'Search';
      }
    }, {
      key: '_renderSelectedItem',
      value: function _renderSelectedItem(item) {
        return this.props.renderSelectedItem ? this.props.renderSelectedItem(item) : JSON.stringify(item);
      }
    }, {
      key: '_selectItem',
      value: function _selectItem(item) {
        var selected = this.state.selected;
        var removedItem = null;

        if (this.props.multi) {
          selected = this.state.selected.concat([item]);
        } else {
          if (this.state.selected.length) {
            removedItem = this.state.selected[0];
          }
          selected = [item];
        }

        this.setState({
          selected: selected
        });
        if (removedItem && this.props.onRemove) {
          this.props.onRemove(removedItem, this.state.selected);
        }
        if (this.props.onSelect) {
          this.props.onSelect(item, this.state.selected);
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _results = this._getResults();
        return _react2.default.createElement(
          'div',
          { className: 'smart-search' },
          _react2.default.createElement(
            'label',
            { className: 'ss-label' },
            this._renderLabel()
          ),
          this.state.selected.map(function (item, i) {
            return _react2.default.createElement(
              'div',
              {
                className: 'ss-selected-item',
                key: i,
                onClick: function onClick() {
                  _this2._removeItem(item);
                } },
              _this2._renderSelectedItem(item)
            );
          }),
          _react2.default.createElement('input', {
            type: 'text',
            name: 'search',
            defaultValue: this.props.query,
            onChange: function onChange(e) {
              _this2._handleChange(e);
            } }),
          _react2.default.createElement(
            'div',
            { className: 'ss-results' },
            _results && _results.map(function (results, i) {
              return _react2.default.createElement(
                'div',
                {
                  className: 'ss-group',
                  key: i },
                _this2.props.showGroupHeading ? _react2.default.createElement(
                  'h3',
                  { className: 'ss-group-heading' },
                  results.label
                ) : '',
                results.items && results.items.map(function (result, j) {
                  return _react2.default.createElement(
                    'div',
                    {
                      className: 'ss-item',
                      key: j,
                      onClick: function onClick() {
                        _this2._selectItem(result);
                      } },
                    _this2._renderItem(result)
                  );
                })
              );
            })
          )
        );
      }
    }]);

    return SmartSearch;
  }(_react2.default.Component);

  SmartSearch.propTypes = {
    label: _react2.default.PropTypes.string,
    query: _react2.default.PropTypes.string,
    search: _react2.default.PropTypes.func.isRequired,
    renderItem: _react2.default.PropTypes.func.isRequired,
    renderSelectedItem: _react2.default.PropTypes.func.isRequired,
    onSelect: _react2.default.PropTypes.func,
    onRemove: _react2.default.PropTypes.func,
    results: _react2.default.PropTypes.array,
    minCharacters: _react2.default.PropTypes.number,
    showGroupHeading: _react2.default.PropTypes.bool
  };
  SmartSearch.defaultProps = {
    query: '',
    minCharacters: 3,
    showGroupHeading: true
  };
  exports.default = SmartSearch;
});