import React from 'react';

class SmartSearch extends React.Component {

  constructor(props) {
    super(props);
    /**
     * @type {object}
     * @property {string} query search query
     * @property {array} selected array of selected items
     */
    this.state = {
      query: '',
      selected: []
    };
    this._selectItem = this._selectItem.bind(this);
    this._removeItem = this._removeItem.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    this._onQueryChange(this.state.query);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      this.setState({
        query: nextProps.query
      });
    }
  }

  _getResults() {
    return this.props.results;
  }

  _handleChange(event) {
    if (event.target.value !== this.state.query) {
      this.setState({
        query: event.target.value
      });

    }
  }

  _onQueryChange(query) {
    // determine if query value length is >= props.minCharacters
    if (!query || query.length < this.props.minCharacters) {
      return;
    }

    // execute search action with search value:
    if (this.props.search) {
      this.props.search(query);
    }
  }

  _removeItem(item) {
    this.setState({
      selected: this.state.selected.filter((val) => {
        return val.id !== item.id;
      })
    });
    if (this.props.onRemove) { this.props.onRemove(item, this.state.selected); }
  }

  _renderItem(item) {
    return this.props.renderItem ? this.props.renderItem(item) : JSON.stringify(item);
  }

  _renderLabel() {
    return this.props.label || 'Search';
  }

  _renderSelectedItem(item) {
    return this.props.renderSelectedItem
      ? this.props.renderSelectedItem(item)
      : JSON.stringify(item);
  }

  _selectItem(item) {
    let selected = this.state.selected;
    let removedItem = null;

    if (this.props.multi) {
      selected = this.state.selected.concat([item]);
    } else {
      if (this.state.selected.length) {
        removedItem = this.state.selected[0];
      }
      selected = [item];
    }

    this.setState({
      query: '',
      selected: selected
    });
    if (removedItem && this.props.onRemove) {
      this.props.onRemove(removedItem, this.state.selected);
    }
    if (this.props.onSelect) { this.props.onSelect(item, this.state.selected); }
  }

  render() {
    let _results = this._getResults();
    return (
      <div className="smart-search">
        <label className="ss-label">{this._renderLabel()}</label>
        {this.state.selected.map(item =>
          <div
            className="ss-selected-item"
            key={item.id}
            onClick={() => {this._removeItem(item)}}>
            {this._renderSelectedItem(item)}
          </div>
        )}
        <input
          type="text"
          name="search"
          value={this.state.query}
          onChange={(e) => { this._handleChange(e); }} />
        <div className="ss-results">
          {_results && _results.map(results =>
            <div
              className="ss-group"
              key={results.key}>
              {this.props.showGroupHeading ?
                <h3 className="ss-group-heading">{results.label}</h3> : '' }
              {results.items.map(result =>
                <div
                  className="ss-item"
                  key={result.id}
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
  query: React.PropTypes.string,
  search: React.PropTypes.func.isRequired,
  renderItem: React.PropTypes.func.isRequired,
  renderSelectedItem: React.PropTypes.func.isRequired,
  onSelect: React.PropTypes.func,
  onRemove: React.PropTypes.func,
  results: React.PropTypes.array,
  minCharacters: React.PropTypes.number,
  showGroupHeading: React.PropTypes.bool
};
SmartSearch.defaultProps = {
  query: '',
  minCharacters: 3,
  showGroupHeading: true
};
export default SmartSearch;
