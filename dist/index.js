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
       * @property {string} query search string
       * @property {bool} focused boolean indicating whether input is focused
       * @property {int} highlightIndex int indicate which result should be highlighted
       */
      _this.state = {
        selected: [],
        query: _this.props.query,
        focused: false,
        highlightIndex: 0
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
      key: '_getComponentClass',
      value: function _getComponentClass() {
        var className = 'Select smart-search';
        if (this.state.focused) {
          className += ' is-focused is-open';
        }
        if (!this.state.query) {
          className += ' is-empty';
        }
        if (this.state.selected.length) {
          className += ' has-value';
        }
        return className;
      }
    }, {
      key: '_getItemClass',
      value: function _getItemClass(index) {
        var className = "Select-option ss-item";
        if (this.state.highlightIndex == index) {
          className += " active";
        }
        return className;
      }
    }, {
      key: '_getResults',
      value: function _getResults() {
        return this.props.results;
      }
    }, {
      key: '_getResultCount',
      value: function _getResultCount() {
        return this._getResults().reduce(function (previous, current) {
          return previous + current.items.length;
        }, 0);
      }
    }, {
      key: '_handleChange',
      value: function _handleChange(event) {
        this._onQueryChange(event.target.value);
      }
    }, {
      key: '_highlightNextResult',
      value: function _highlightNextResult() {
        var index = this.state.highlightIndex;
        if (this._getResultCount() <= index + 1) {
          index = -1;
        }
        this.setState({
          highlightIndex: index + 1
        });
      }
    }, {
      key: '_highlightPreviousResult',
      value: function _highlightPreviousResult() {
        var index = this.state.highlightIndex;
        if (index - 1 < 0) {
          index = this._getResultCount();
        }
        this.setState({
          highlightIndex: index - 1
        });
      }
    }, {
      key: '_onBlur',
      value: function _onBlur() {
        this.setState({
          focused: false
        });
      }
    }, {
      key: '_onFocus',
      value: function _onFocus() {
        this.setState({
          focused: true
        });
      }
    }, {
      key: '_onKeyDown',
      value: function _onKeyDown(e) {
        var stop = false;

        switch (e.which) {
          case 8:
            if (!this.state.query && this.state.selected.length) {
              this._removeItem(this.state.selected[this.state.selected.length - 1]);
            }
            break;
          case 38:
            // up
            stop = true;
            this._highlightPreviousResult();
            break;
          case 40:
            // down
            stop = true;
            this._highlightNextResult();
            break;
          case 13:
          case 176:
            // enter / numpad enter
            stop = true;
            this._selectHighlighted();
            break;
        }
        if (stop) {
          e.stopPropagation();
          e.preventDefault();
        }
      }
    }, {
      key: '_onQueryChange',
      value: function _onQueryChange(query) {
        this.setState({
          query: query
        });

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
      key: '_selectHighlighted',
      value: function _selectHighlighted() {
        var results = this._getResults();
        if (!results || !results.length) {
          return;
        }

        var highlightedItem = results[0],
            offset = 0;

        for (var i = 0, len = results.length; i < len; i++) {
          if (offset + results[i].items.length <= this.state.highlightIndex) {
            offset += results[i].items.length;
            continue;
          }
          highlightedItem = results[i].items[this.state.highlightIndex - offset];
          break;
        }

        this._selectItem(highlightedItem);
      }
    }, {
      key: '_selectItem',
      value: function _selectItem(item) {
        var selected = this.state.selected;
        var removedItem = null;

        if (this.props.multi) {
          var alreadyExists = this.state.selected.reduce(function (previous, current) {
            return previous || current.id == item.id;
          }, false);
          if (!alreadyExists) {
            selected = this.state.selected.concat([item]);
          }
        } else {
          if (this.state.selected.length) {
            removedItem = this.state.selected[0];
          }
          selected = [item];
        }

        this.setState({
          selected: selected,
          query: ''
        });
        if (removedItem && this.props.onRemove) {
          this.props.onRemove(removedItem, selected);
        }
        if (this.props.onSelect) {
          this.props.onSelect(item, selected);
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _results = this._getResults();
        return _react2.default.createElement(
          'div',
          { className: this._getComponentClass() },
          _react2.default.createElement(
            'label',
            { className: 'ss-label' },
            this._renderLabel()
          ),
          _react2.default.createElement(
            'div',
            { className: 'Select-control' },
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
            _react2.default.createElement(
              'div',
              { className: 'Select-input' },
              _react2.default.createElement('input', {
                autoComplete: 'off',
                type: 'text',
                name: 'search',
                value: this.state.query,
                onChange: function onChange(e) {
                  _this2._handleChange(e);
                },
                onFocus: function onFocus() {
                  _this2._onFocus();
                },
                onBlur: function onBlur() {
                  _this2._onBlur();
                },
                onKeyDown: function onKeyDown(e) {
                  _this2._onKeyDown(e);
                } })
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'Select-menu-outer ss-results' },
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
                      className: _this2._getItemClass(j),
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