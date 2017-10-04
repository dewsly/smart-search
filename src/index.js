import React from 'react';
import classNames from 'classnames';
import objectAssign from 'object-assign';

const noop = () => {};

class SmartSearch extends React.Component {

  constructor(props) {
    super(props);
    /**
     * @type {object}
     * @property {array} selected array of selected items
     * @property {string} query search string
     * @property {bool} focused boolean indicating whether input is focused
     * @property {int} highlightIndex int indicate which result should be highlighted
     * @property {object} cache object map of query -> results
     * @property {array} cachedResults array of results to use when caching enabled
     */
    this.state = {
      selected: [],
      query: this.props.query,
      focused: false,
      open: false,
      loading: false,
      highlightIndex: -1,
      cache: {},
      cachedResults: [],
      showSearchResults: !this.props.search
    };
    this._selectItem = this._selectItem.bind(this);
    this._removeItem = this._removeItem.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this._hasChanged(this.props.query, nextProps.query)) {
      this._onQueryChange(nextProps.query);
    }

    if (this._hasChanged(this.props.selected, nextProps.selected)) {
      this.setState({selected: nextProps.selected});
    }
  }

  _hasChanged(oldValue, newValue) {
    return JSON.stringify(oldValue) !== JSON.stringify(newValue);
  }

  componentDidMount() {
    if (this.props.autoload && this.props.search) {
      this._onQueryChange(this.props.query || '');
    }

    if (this.props.focusOnMount && this._input) {
      this._input.focus();
    }

    if (this.props.selected) {
      this.setState({selected:this.props.selected || []});
    }
  }

  componentWillUnmount() {
    clearTimeout(this._queryTimeout);
    clearTimeout(this._blurTimeout);
    clearTimeout(this._highlightTimeout);
  }

  _focus() {
    if (this._input) {
      this._input.focus();
      this._onFocus();
    }
  }

  _blur() {
    if (this._input) {
      this._input.blur();
      this._onBlur();
    }
  }

  _toggleOpen() {
    if (this.props.searchable) { return; }
    this.setState({
      open: !this.state.open
    });
  }

  _getComponentClass() {
    let className = classNames('smart-search', {
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

  _getItemClass(index) {
    let className = "ss-item";
    if (this.state.highlightIndex == index) {
      className += " active";
    }
    return className;
  }

  _getResults() {
    let self = this;
    let results = this.state.cachedResults && this.state.cachedResults.length ? this.state.cachedResults : this.props.results;
    if (!this.props.search || !this.props.filterSelected) {
      return results;
    }

    // remove any selected results from the set:
    let filteredResults = results.map((group) => {
      if (!group || !group.items) {
        return group;
      }

      let filteredItems = group.items.filter((result) => {
        return !self._isSelected(result);
      });
      let updated = objectAssign({}, group);
      updated.items = filteredItems;

      return updated;
    });

    return filteredResults;
  }

  _getResultCount() {
    let results = this._getResults();
    return results ? results.reduce((previous, current) => {
      return previous + (current && current.items ? current.items.length : 0);
    }, 0) : 0;
  }

  _handleChange(event) {
    if (!this.props.searchable) {
      return;
    }

    this._onQueryChange(event.target.value);
  }

  _highlightNextResult() {
    let index = this.state.highlightIndex;
    if (this._getResultCount() <= (index + 1)) {
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

  _highlightPreviousResult() {
    let index = this.state.highlightIndex;
    if ((index-1) < 0) {
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

  _isSelected(item) {
    let found = this.state.selected.filter((result) => {
      return result.id === item.id;
    });
    return found.length;
  }

  _onBlur() {
    let self = this;
    clearTimeout(self._blurTimeout);
    self._blurTimeout = setTimeout(function() {
      self.setState({
        focused: false,
        open: false
      });
      if (self.props.onBlur) { self.props.onBlur(); }
    }, 200);
  }

  _onFocus() {
    clearTimeout(this._blurTimeout);
    var stateObj = {
      focused: true
    };
    if (this.props.searchable) {
      stateObj.open = true;
    }
    this.setState(stateObj);

    if (this.props.minCharacters === 0
        && this.props.search
        && !this.state.query
      ) {
      this._onQueryChange('');
    }

    if (this._results) {
      this._results.scrollTop = 0;
    }

    if (this.props.onFocus) { this.props.onFocus(); }
}

  _onKeyDown(e) {
    let stop = false;

    switch(e.which) {
      case 8:
        // delete
        if (!this.state.query
            && this.state.selected.length
            && this.props.searchable
            && this.props.allowDelete
        ) {
          this._removeItem(this.state.selected[this.state.selected.length-1]);
        }
        break;
      case 27:
        // escape
        stop = true;
        if (!this.props.searchable) {
          this.setState({'open': false});
        }
        break;
      case 32:
        // spacebar
        if (this.state.highlightIndex != -1) {
          this._selectHighlighted();
        }
        if(!this.props.searchable) {
          stop = true;
          this._toggleOpen();
        }
        break;
      case 38:
        // up
        stop = true;
        if (!this.state.open && this.state.focused) {
          this.setState({'open': true});
        }
        this._highlightPreviousResult();
        break;
      case 40:
        // down
        stop = true;
        if (!this.state.open && this.state.focused) {
          this.setState({'open': true});
        }
        this._highlightNextResult();
        break;
      case 13:
      case 176:
        // enter / numpad enter
        stop = true;
        if (!this.props.searchable) {
          this.setState({'open': false});
        }
        this._selectHighlighted();

        break;
    }
    if (stop) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  _onQueryChange(query) {
    console.log(query);
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

  _removeItem(item) {
    const selected = this.state.selected.filter((val) => {
      return val.id !== item.id;
    });
    this.setState({
      selected: selected
    });
    if (this.props.onRemove) { this.props.onRemove(item, selected); }

    if (this.props.focusAfterRemove) {
      this._focus();
    }
  }

  _removeItemCallback(item) {
    return () => {
      this._removeItem(item);
    };
  }

  _renderItem(item) {
    return this.props.renderItem ? this.props.renderItem(item) : JSON.stringify(item);
  }

  _renderLabel() {
    return this.props.label || 'Search';
  }

  _renderSelectedItem(item) {
    return this.props.renderSelectedItem
      ? this.props.renderSelectedItem(item, this._removeItemCallback(item))
      : JSON.stringify(item);
  }

  _selectHighlighted() {
    let results = this._getResults();
    if (!results || !results.length || this.state.highlightIndex < 0) {
      return;
    }

    let highlightedItem = results[0]
      , offset = 0;

    for (let i=0, len=results.length; i<len; i++) {
      if (offset + results[i].items.length <= this.state.highlightIndex ) {
        offset += results[i].items.length;
        continue;
      }
      highlightedItem = results[i].items[this.state.highlightIndex - offset];
      break;
    }

    this._selectItem(highlightedItem);
  }

  _selectItem(item) {
    let selected = this.state.selected;
    let removedItem = null;

    if (this.props.multi) {
      let alreadyExists = selected.reduce((previous, current) => {
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
    let updatedState = {
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
    }
  }

  render() {
    let _results = this._getResults();
    return (
      <div className={this._getComponentClass()}>
        <label
          className="ss-label"
          title={this._renderLabel()}>{this._renderLabel()}</label>
        <div className="ss-control">
          {this.state.selected.map((item, i) =>
            <div
              className="ss-selected-item"
              key={i}>
              {this._renderSelectedItem(item)}
            </div>
          )}
          <div className="ss-input">
            <input
              autoComplete="off"
              type="text"
              name="search"
              ref={(e) => { this._input = e; }}
              title={this._renderLabel()}
              value={this.state.query}
              onClick={(e) => { this._toggleOpen(); }}
              onChange={(e) => { this._handleChange(e); }}
              onFocus={() => { this._onFocus(); }}
              onBlur={() => { this._onBlur(); }}
              onKeyDown={(e) => { this._onKeyDown(e); }} />
          </div>
        </div>
        {(this.state.showSearchResults &&
          this._getResultCount() == 0 &&
          !!this.props.renderNoResultsMessage
        ) && (
          <div className="ss-no-results">
            {this.props.renderNoResultsMessage()}
          </div>
        )}
        <div className="ss-results"
             ref={(e) => { this._results = e; }}>
          {(this.state.showSearchResults && _results) && _results.map((results, i) =>
            <div
              className="ss-group"
              key={i}>
              {this.props.showGroupHeading && results.label ?
                <h3 className="ss-group-heading">{results.label}</h3> : '' }
              {results.items && results.items.map((result, j) =>
                <div
                  className={this._getItemClass(j)}
                  ref={(e) => { if(this.state.highlightIndex === j) { this._highlightedItem = e; }}}
                  key={(results.key || this.state.query.trim().replace(/\s/g, '-')) + '.' + j}
                  onClick={() => {this._selectItem(result)}}>
                  {this._renderItem(result)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

}

SmartSearch.propTypes = {
  label: React.PropTypes.string,
  query: React.PropTypes.string,
  search: React.PropTypes.func,
  renderItem: React.PropTypes.func.isRequired,
  renderSelectedItem: React.PropTypes.func.isRequired,
  onSelect: React.PropTypes.func,
  onRemove: React.PropTypes.func,
  results: React.PropTypes.array,
  minCharacters: React.PropTypes.number,
  showGroupHeading: React.PropTypes.bool,
  cache: React.PropTypes.bool,
  delay: React.PropTypes.number,
  selected: React.PropTypes.array,
  focusAfterSelect: React.PropTypes.bool,
  focusAfterRemove: React.PropTypes.bool,
  searchable: React.PropTypes.bool,
  autoload: React.PropTypes.bool,
  focusOnMount: React.PropTypes.bool,
  filterSelected: React.PropTypes.bool,
  onFocus: React.PropTypes.func,
  onBlur: React.PropTypes.func,
  onQueryUpdated: React.PropTypes.func,
  allowDelete: React.PropTypes.bool,
  renderNoResultsMessage: React.PropTypes.func
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
export default SmartSearch;
