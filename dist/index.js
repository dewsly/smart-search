(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'classnames', 'object-assign'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('classnames'), require('object-assign'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.classnames, global.objectAssign);
    global.index = mod.exports;
  }
})(this, function (exports, _react, _classnames, _objectAssign) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _classnames2 = _interopRequireDefault(_classnames);

  var _objectAssign2 = _interopRequireDefault(_objectAssign);

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

  var noop = function noop() {};

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
       * @property {object} cache object map of query -> results
       * @property {array} cachedResults array of results to use when caching enabled
       */
      _this.state = {
        selected: [],
        query: _this.props.query,
        focused: false,
        open: false,
        loading: false,
        highlightIndex: -1,
        cache: {},
        cachedResults: [],
        showSearchResults: !_this.props.search
      };
      _this._selectItem = _this._selectItem.bind(_this);
      _this._removeItem = _this._removeItem.bind(_this);
      return _this;
    }

    _createClass(SmartSearch, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (this._hasChanged(this.props.query, nextProps.query)) {
          this._onQueryChange(nextProps.query);
        }

        if (this._hasChanged(this.props.selected, nextProps.selected)) {
          this.setState({ selected: nextProps.selected });
        }
      }
    }, {
      key: '_hasChanged',
      value: function _hasChanged(oldValue, newValue) {
        return JSON.stringify(oldValue) !== JSON.stringify(newValue);
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        if (this.props.autoload && this.props.search) {
          this._onQueryChange(this.props.query || '');
        }

        if (this.props.focusOnMount && this._input) {
          this._input.focus();
        }

        if (this.props.selected) {
          this.setState({ selected: this.props.selected || [] });
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        clearTimeout(this._queryTimeout);
        clearTimeout(this._blurTimeout);
        clearTimeout(this._highlightTimeout);
      }
    }, {
      key: '_focus',
      value: function _focus() {
        if (this._input) {
          this._input.focus();
          this._onFocus();
        }
      }
    }, {
      key: '_blur',
      value: function _blur() {
        if (this._input) {
          this._input.blur();
          this._onBlur();
        }
      }
    }, {
      key: '_toggleOpen',
      value: function _toggleOpen() {
        if (this.props.searchable) {
          return;
        }
        this.setState({
          open: !this.state.open
        });
      }
    }, {
      key: '_getComponentClass',
      value: function _getComponentClass() {
        var className = (0, _classnames2.default)('smart-search', {
          'is-focused': this.state.focused,
          'is-open': this.state.open,
          'is-empty': !this.state.query,
          'is-loading': this.state.loading,
          'has-value': this.state.selected.length,
          'multi': this.props.multi,
          'single': !this.props.multi,
          'searchable': this.props.searchable,
          'not-searchable': !this.props.searchable,
          'has-results': this._getResultCount()
        });

        return className;
      }
    }, {
      key: '_getItemClass',
      value: function _getItemClass(index) {
        var className = "ss-item";
        if (this.state.highlightIndex == index) {
          className += " active";
        }
        return className;
      }
    }, {
      key: '_getResults',
      value: function _getResults() {
        var self = this;
        var results = this.state.cachedResults && this.state.cachedResults.length ? this.state.cachedResults : this.props.results;
        if (!this.props.filterSelected || !results) {
          return results;
        }

        // remove any selected results from the set:
        var filteredResults = results.map(function (group) {
          if (!group || !group.items) {
            return group;
          }

          var filteredItems = group.items.filter(function (result) {
            return !self._isSelected(result);
          });
          var updated = (0, _objectAssign2.default)({}, group);
          updated.items = filteredItems;

          return updated;
        });

        return filteredResults;
      }
    }, {
      key: '_getResultCount',
      value: function _getResultCount() {
        var results = this._getResults();
        return results ? results.reduce(function (previous, current) {
          return previous + (current && current.items ? current.items.length : 0);
        }, 0) : 0;
      }
    }, {
      key: '_handleChange',
      value: function _handleChange(event) {
        if (!this.props.searchable) {
          return;
        }

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

        var self = this;
        clearTimeout(this._highlightTimeout);
        this._highlightTimeout = setTimeout(function () {
          if (self._highlightedItem) {
            if (self._highlightedItem.scrollIntoViewIfNeeded) {
              self._highlightedItem.scrollIntoViewIfNeeded();
            } else {
              self._highlightedItem.scrollIntoView();
            }
          }
        }, 0);
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

        var self = this;
        clearTimeout(this._highlightTimeout);
        this._highlightTimeout = setTimeout(function () {
          if (self._highlightedItem) {
            if (self._highlightedItem.scrollIntoViewIfNeeded) {
              self._highlightedItem.scrollIntoViewIfNeeded();
            } else {
              self._highlightedItem.scrollIntoView();
            }
          }
        }, 0);
      }
    }, {
      key: '_isSelected',
      value: function _isSelected(item) {
        var found = this.state.selected.filter(function (result) {
          return item.id && result.id === item.id;
        });
        return found.length;
      }
    }, {
      key: '_onBlur',
      value: function _onBlur() {
        var self = this;
        clearTimeout(self._blurTimeout);
        self._blurTimeout = setTimeout(function () {
          self.setState({
            focused: false,
            open: false
          });
          if (self.props.onBlur) {
            self.props.onBlur();
          }
        }, 200);
      }
    }, {
      key: '_onFocus',
      value: function _onFocus() {
        clearTimeout(this._blurTimeout);
        var stateObj = {
          focused: true
        };
        if (this.props.searchable) {
          stateObj.open = true;
        }
        this.setState(stateObj);

        if (this.props.minCharacters === 0 && this.props.search && !this.state.query) {
          this._onQueryChange('');
        }

        if (this._results) {
          this._results.scrollTop = 0;
        }

        if (this.props.onFocus) {
          this.props.onFocus();
        }
      }
    }, {
      key: '_onKeyDown',
      value: function _onKeyDown(e) {
        var stop = false;

        switch (e.which) {
          case 8:
            // delete
            if (!this.state.query && this.state.selected.length && this.props.searchable && this.props.allowDelete) {
              this._removeItem(this.state.selected[this.state.selected.length - 1]);
            }
            break;
          case 27:
            // escape
            stop = true;
            if (!this.props.searchable) {
              this.setState({ 'open': false });
            }
            break;
          case 32:
            // spacebar
            if (this.state.highlightIndex != -1) {
              this._selectHighlighted();
            }
            if (!this.props.searchable) {
              stop = true;
              this._toggleOpen();
            }
            break;
          case 38:
            // up
            stop = true;
            if (!this.state.open && this.state.focused) {
              this.setState({ 'open': true });
            }
            this._highlightPreviousResult();
            break;
          case 40:
            // down
            stop = true;
            if (!this.state.open && this.state.focused) {
              this.setState({ 'open': true });
            }
            this._highlightNextResult();
            break;
          case 13:
          case 176:
            // enter / numpad enter
            stop = true;
            if (!this.props.searchable) {
              this.setState({ 'open': false });
            }
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
        if (this.props.search) {
          clearTimeout(this._queryTimeout);
          this.setState({
            showSearchResults: false
          });
        }

        this.setState({
          query: query
        });
        this.props.onQueryUpdated(query);

        // determine if query value length is >= props.minCharacters
        if (query.length < this.props.minCharacters) {
          return;
        }

        if (this.props.cache && this.state.cache[query]) {
          // set cached results to value of cache
          this.setState({
            showSearchResults: true,
            cachedResults: this.state.cache[query]
          });
          return;
        }
        // execute search action with search value:
        if (this.props.search) {
          var self = this;
          self._queryTimeout = setTimeout(function () {
            self.setState({
              loading: true,
              cachedResults: []
            });
            self.props.search(query, function (err, results) {
              var cache = self.state.cache;
              if (query == self.state.query) {
                results = self.state.cachedResults.concat(results);
              }
              if (self.props.cache) {
                cache[query] = results;
              }
              self.setState({
                cachedResults: results,
                cache: cache,
                loading: false,
                showSearchResults: true
              });
            });
          }, self.props.delay);
        }
      }
    }, {
      key: '_removeItem',
      value: function _removeItem(item) {
        var selected = this.state.selected.filter(function (val) {
          return val.id !== item.id;
        });
        this.setState({
          selected: selected
        });
        if (this.props.onRemove) {
          this.props.onRemove(item, selected);
        }

        if (this.props.focusAfterRemove) {
          this._focus();
        }
      }
    }, {
      key: '_removeItemCallback',
      value: function _removeItemCallback(item) {
        var _this2 = this;

        return function () {
          _this2._removeItem(item);
        };
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
        return this.props.renderSelectedItem ? this.props.renderSelectedItem(item, this._removeItemCallback(item)) : JSON.stringify(item);
      }
    }, {
      key: '_selectHighlighted',
      value: function _selectHighlighted() {
        var results = this._getResults();
        if (!results || !results.length || this.state.highlightIndex < 0) {
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
          var alreadyExists = selected.reduce(function (previous, current) {
            return previous || current.id == item.id;
          }, false);
          if (!alreadyExists) {
            selected = selected.concat([item]);
          }
        } else {
          if (selected.length) {
            removedItem = selected[0];
          }
          selected = [item];
        }
        var updatedState = {
          selected: selected,
          query: '',
          highlightIndex: -1
        };
        if (this.props.multi) {
          updatedState.cachedResults = [];
        }
        this.setState(updatedState);

        this.props.onQueryUpdated('');

        if (removedItem && this.props.onRemove) {
          this.props.onRemove(removedItem, selected);
        }
        if (this.props.onSelect) {
          this.props.onSelect(item, selected);
        }
        if (this.props.focusAfterSelect) {
          this._focus();
        } else {
          this._blur();
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        var _results = this._getResults();
        return _react2.default.createElement(
          'div',
          { className: this._getComponentClass() },
          _react2.default.createElement(
            'label',
            {
              className: 'ss-label',
              title: this._renderLabel() },
            this._renderLabel()
          ),
          _react2.default.createElement(
            'div',
            { className: 'ss-control' },
            this.state.selected.map(function (item, i) {
              return _react2.default.createElement(
                'div',
                {
                  className: 'ss-selected-item',
                  key: i },
                _this3._renderSelectedItem(item)
              );
            }),
            _react2.default.createElement(
              'div',
              { className: 'ss-input', onClick: function onClick(e) {
                  _this3._toggleOpen();
                } },
              _react2.default.createElement('input', {
                autoComplete: 'off',
                type: 'text',
                name: 'search',
                ref: function ref(e) {
                  _this3._input = e;
                },
                title: this._renderLabel(),
                value: this.state.query,
                onChange: function onChange(e) {
                  _this3._handleChange(e);
                },
                onFocus: function onFocus() {
                  _this3._onFocus();
                },
                onBlur: function onBlur() {
                  _this3._onBlur();
                },
                onKeyDown: function onKeyDown(e) {
                  _this3._onKeyDown(e);
                } })
            )
          ),
          this.state.showSearchResults && this._getResultCount() == 0 && !!this.props.renderNoResultsMessage && _react2.default.createElement(
            'div',
            { className: 'ss-no-results' },
            this.props.renderNoResultsMessage()
          ),
          _react2.default.createElement(
            'div',
            { className: 'ss-results',
              ref: function ref(e) {
                _this3._results = e;
              } },
            this.state.showSearchResults && _results && _results.map(function (results, i) {
              return _react2.default.createElement(
                'div',
                {
                  className: 'ss-group',
                  key: i },
                _this3.props.showGroupHeading && results.label ? _react2.default.createElement(
                  'h3',
                  { className: 'ss-group-heading' },
                  results.label
                ) : '',
                results.items && results.items.map(function (result, j) {
                  return _react2.default.createElement(
                    'div',
                    {
                      className: _this3._getItemClass(j),
                      ref: function ref(e) {
                        if (_this3.state.highlightIndex === j) {
                          _this3._highlightedItem = e;
                        }
                      },
                      key: (results.key || _this3.state.query.trim().replace(/\s/g, '-')) + '.' + j,
                      onClick: function onClick() {
                        _this3._selectItem(result);
                      } },
                    _this3._renderItem(result)
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
    search: _react2.default.PropTypes.func,
    renderItem: _react2.default.PropTypes.func.isRequired,
    renderSelectedItem: _react2.default.PropTypes.func.isRequired,
    onSelect: _react2.default.PropTypes.func,
    onRemove: _react2.default.PropTypes.func,
    results: _react2.default.PropTypes.array,
    minCharacters: _react2.default.PropTypes.number,
    showGroupHeading: _react2.default.PropTypes.bool,
    cache: _react2.default.PropTypes.bool,
    delay: _react2.default.PropTypes.number,
    selected: _react2.default.PropTypes.array,
    focusAfterSelect: _react2.default.PropTypes.bool,
    focusAfterRemove: _react2.default.PropTypes.bool,
    searchable: _react2.default.PropTypes.bool,
    autoload: _react2.default.PropTypes.bool,
    focusOnMount: _react2.default.PropTypes.bool,
    filterSelected: _react2.default.PropTypes.bool,
    onFocus: _react2.default.PropTypes.func,
    onBlur: _react2.default.PropTypes.func,
    onQueryUpdated: _react2.default.PropTypes.func,
    allowDelete: _react2.default.PropTypes.bool,
    renderNoResultsMessage: _react2.default.PropTypes.func
  };
  SmartSearch.defaultProps = {
    query: '',
    minCharacters: 3,
    showGroupHeading: true,
    cache: false,
    results: [],
    delay: 500,
    selected: [],
    focusAfterSelect: true,
    focusAfterRemove: true,
    searchable: true,
    autoload: false,
    focusOnMount: false,
    filterSelected: true,
    onQueryUpdated: noop,
    allowDelete: true
  };
  exports.default = SmartSearch;
});