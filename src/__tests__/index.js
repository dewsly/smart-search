import React from 'react';

import {shallow, mount, render} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';

import SmartSearch from '../index';

// Demo tests

// Shallow Rendering
// https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md
describe('Shallow Rendering', () => {
  let results = [];

  before(function (done) {
    results = [
      {
        'key': 'people',
        'label': 'People',
        'items': [
          {
            'name': 'Alf',
            'id': '1'
          },
          {
            'name': 'Bananas',
            'id': '2'
          }
        ]

      },
      {
        'key': 'schools',
        'label': 'Schools',
        'items': [
          {
            'name': 'School #1',
            'id': '3'
          },
          {
            'name': 'School #2',
            'id': '5'
          }
        ]

      }
    ];

    done();
  });

  it('updates .ss-label based on label parameter', () => {
    const wrapper = shallow(<SmartSearch label="NEW LABEL" />);
    expect(wrapper.find('.ss-label').text()).to.equal('NEW LABEL');
  });

  it('adds .multi class to the container when multi is truthy', () => {
    const wrapper = shallow(<SmartSearch multi={true}/>);
    expect(wrapper.find('.smart-search.multi')).to.have.length(1);
    expect(wrapper.find('.smart-search.single')).to.have.length(0);
  });

  it('adds .single class to the container when multi is falsy', () => {
    const wrapper = shallow(<SmartSearch multi={false}/>);
    expect(wrapper.find('.smart-search.multi')).to.have.length(0);
    expect(wrapper.find('.smart-search.single')).to.have.length(1);
  });

  it('adds .has-results class when there are results', () => {
    const wrapper = shallow(<SmartSearch results={results} />);
    expect(wrapper.find('.smart-search.has-results')).to.have.length(1);
  });

  it('does not have .has-results class when no results', () => {
    const wrapper = shallow(<SmartSearch />);
    expect(wrapper.find('.smart-search.has-results')).to.have.length(0);

    wrapper.setProps({
      results:[{
        'key': 'people',
        'label': 'People',
        'items': []
      }]
    });
    expect(wrapper.find('.smart-search.has-results')).to.have.length(0);
  });

  it('to have 0 .ss-group elements when no results', () => {
    const wrapper = shallow(<SmartSearch />);
  });

  it('to have 2 .ss-group elements', () => {
    const wrapper = shallow(
      <SmartSearch results={results} />
    );

    expect(wrapper.find('.ss-group')).to.have.length(2);
  });

  it('to have 4 .ss-item elements', () => {
    const wrapper = shallow(
      <SmartSearch results={results} />
    );

    expect(wrapper.find('.ss-item')).to.have.length(4);
  });

  it('triggers onSelect when item has been clicked', () => {
    const onSelect = sinon.spy();

    const wrapper = shallow(
      <SmartSearch
        onSelect={onSelect}
        results={results} />
    );
    wrapper.find('.ss-item').first().simulate('click');
    expect(onSelect.calledOnce).to.equal(true);
  });

  it('triggers onSelect and passes selectedItem and selectedItems', () => {
    const onSelect = sinon.spy();

    const wrapper = shallow(
      <SmartSearch
        onSelect={onSelect}
        results={results} />
    );
    wrapper.find('.ss-item').first().simulate('click');
    expect(onSelect.calledOnce).to.equal(true);
    expect(onSelect.getCall(0).args.length).to.equal(2);
    expect(onSelect.getCall(0).args[0]).to.be.an('object');
    expect(onSelect.getCall(0).args[1]).to.be.an('array');
  });

  it('has one .ss-selected-item after clicking on a result', () => {
    const wrapper = shallow(
      <SmartSearch
        results={results} />
    );
    wrapper.find('.ss-item').first().simulate('click');
    expect(wrapper.find('.ss-selected-item')).to.have.length(1);
  });

  it('has one .ss-selected-item after clicking on the same result', () => {
    const wrapper = shallow(
      <SmartSearch
        results={results} />
    );
    wrapper.find('.ss-item').first().simulate('click');
    expect(wrapper.find('.ss-selected-item')).to.have.length(1);
    wrapper.find('.ss-item').first().simulate('click');
    expect(wrapper.find('.ss-selected-item')).to.have.length(1);
  });

  it('clears query state after clicking on a result', () => {
    const wrapper = shallow(
      <SmartSearch
        query="Something"
        results={results} />
    );
    expect(wrapper.state().query).to.equal('Something');
    wrapper.find('.ss-item').first().simulate('click');
    expect(wrapper.state().query).to.equal('');
  });

  it('calls onQueryUpdated with empty string after clicking on a result', () => {
    const onQueryUpdated = sinon.spy();

    const wrapper = shallow(
      <SmartSearch
        query="Something"
        onQueryUpdated={onQueryUpdated}
        results={results} />
    );
    expect(wrapper.state().query).to.equal('Something');
    wrapper.find('.ss-item').first().simulate('click');
    expect(onQueryUpdated.callCount).to.equal(1);
    expect(onQueryUpdated.getCall(0).args[0]).to.be.an('string').and.equal('');
  });

  it('triggers onRemove when selected item has been removed', () => {
    const onRemove = sinon.spy();

    var renderSelectedItem = function(item, removeItem) {
      return (
        <div className="item">
          <span className="item-icon" onClick={removeItem}>×</span>
          <span className="item-label">Hello</span>
        </div>
      );
    }
    const wrapper = shallow(
      <SmartSearch
        onRemove={onRemove}
        results={results}
        renderSelectedItem={renderSelectedItem}
      />
    );
    wrapper.find('.ss-item').first().simulate('click');
    wrapper.find('.ss-selected-item .item-icon').first().simulate('click');
    expect(onRemove.calledOnce).to.equal(true);
  });

  it('triggers onRemove and passes removedItem and selectedItems', () => {
    const onRemove = sinon.spy();
    var renderSelectedItem = function(item, removeItem) {
      return (
        <div className="item">
          <span className="item-icon" onClick={removeItem}>×</span>
          <span className="item-label">Hello</span>
        </div>
      );
    }
    const wrapper = shallow(
      <SmartSearch
        onRemove={onRemove}
        results={results}
        renderSelectedItem={renderSelectedItem}
      />
    );
    wrapper.find('.ss-item').first().simulate('click');
    wrapper.find('.ss-selected-item .item-icon').first().simulate('click');
    expect(onRemove.calledOnce).to.equal(true);
    expect(onRemove.getCall(0).args.length).to.equal(2);
    expect(onRemove.getCall(0).args[0]).to.be.an('object');
    expect(onRemove.getCall(0).args[1]).to.be.an('array');
  });

  it('renders group heading when showGroupHeading is truthy', () => {
    const wrapper = shallow(
      <SmartSearch
        showGroupHeading={true}
        results={results} />
    );
    expect(wrapper.find('.ss-group-heading')).to.have.length(2);
  });

  it('does not render group headings when showGroupHeading is falsy', () => {
    const wrapper = shallow(
      <SmartSearch
        showGroupHeading={false}
        results={results} />
    );
    expect(wrapper.find('.ss-group-heading')).to.have.length(0);
  });

  it('does not render group headings when no group label is provided', () => {
    const noLabel = [
      {
        'key': 'people',
        'items': [
          {
            'name': 'Alf',
            'id': '1'
          },
          {
            'name': 'Bananas',
            'id': '2'
          }
        ]

      }
    ];
    const wrapper = shallow(
      <SmartSearch
        showGroupHeading={true}
        results={noLabel} />
    );
    expect(wrapper.find('.ss-group-heading')).to.have.length(0);
  })

  it('only has one selected item when multi=false', () => {
    const wrapper = shallow(
      <SmartSearch
        results={results}
        multi={false} />
    );
    wrapper.find('.ss-item').first().simulate('click');
    wrapper.find('.ss-item').last().simulate('click');
    expect(wrapper.state().selected.length).to.equal(1);
  });

  it('triggers onRemove when multi=false and previously selected item exists', () => {
    const onSelect = sinon.spy();
    const onRemove = sinon.spy();

    const wrapper = shallow(
      <SmartSearch
        onSelect={onSelect}
        onRemove={onRemove}
        results={results}
        multi={false} />
    );
    wrapper.find('.ss-item').first().simulate('click');
    wrapper.find('.ss-item').last().simulate('click');
    expect(onSelect.callCount).to.equal(2);
    expect(onRemove.calledOnce).to.equal(true);
    expect(onRemove.getCall(0).args[0]).to.have.property('id');
    expect(onRemove.getCall(0).args[0].id).to.equal(results[0].items[0].id);
  });

});

// Full DOM Rendering
// https://github.com/airbnb/enzyme/blob/master/docs/api/mount.md
describe('Full DOM Rendering', () => {
  let results = [];
  let noresults = [];

  before(function (done) {
    results = [
      {
        'key': 'people',
        'label': 'People',
        'items': [
          {
            'name': 'Alf',
            'id': '1'
          },
          {
            'name': 'Bananas',
            'id': '2'
          }
        ]

      },
      {
        'key': 'schools',
        'label': 'Schools',
        'items': [
          {
            'name': 'School #1',
            'id': '3'
          },
          {
            'name': 'School #2',
            'id': '5'
          }
        ]

      }
    ];

    done();
  });

  it('pre-populates selected items when passing in items', (done) => {
    let selected = results[0].items;

    const wrapper = mount(
      <SmartSearch
        results={results}
        selected={selected} />
    );
    setTimeout(function () {
      expect(wrapper.find('.ss-selected-item')).to.have.length(2);
      done();
    }, 0);
  });

  it('should not trigger props.search when props.query.lengths < props.minCharacters', () => {
    const search = sinon.spy();
    const wrapper = mount(<SmartSearch delay={0} search={search} query='' results={noresults} />);
    expect(wrapper.props().query).to.equal('');
    wrapper.setProps({ query: 'se' });
    expect(wrapper.props().query).to.equal('se');
    expect(search.called).to.equal(false);
  });

  it('should trigger props.search when props.query.length >= props.minCharacters', (done) => {
    const search = sinon.spy();
    const wrapper = mount(<SmartSearch delay={0} search={search} query='' results={noresults} />);
    expect(wrapper.props().query).to.equal('');
    wrapper.setProps({ query: 'search' });
    expect(wrapper.props().query).to.equal('search');
    expect(wrapper.props().delay).to.equal(0);

    setTimeout(function () {
      expect(search.callCount).to.equal(1);
      done();
    }, 0);

  });

  it('should immediately trigger props.search when props.autoload == 1', (done) => {
    const search = sinon.spy();
    const wrapper = mount(<SmartSearch delay={0} autoload={true} search={search} />);
    setTimeout(function () {
      expect(search.callCount).to.equal(1);
      done();
    }, wrapper.props().delay);
  });

  it('should not trigger props.search when searching for a cached query', (done) => {
    const search = sinon.stub().callsArgWith(1, null, {"label":"Users", "items":results});

    const wrapper = mount(<SmartSearch delay={0} search={search} query='' results={noresults} cache={true} />);
    expect(wrapper.props().query).to.equal('');

    wrapper.setProps({ query: 'search', results: noresults });
    expect(wrapper.props().query).to.equal('search');
    wrapper.setProps({ query: 'se' });
    expect(wrapper.props().query).to.equal('se');
    wrapper.setProps({ query: 'search' });
    expect(wrapper.props().query).to.equal('search');

    setTimeout(function () {
      expect(search.callCount).to.equal(1);
      done();
    }, 0);
  });

  it('should update query state when input field value changes', () => {
    const wrapper = mount(<SmartSearch query='' />);
    expect(wrapper.state().query).to.equal('');
    let input = wrapper.find('input').simulate('change', { target: {value:'test'} });
    expect(wrapper.state().query).to.equal('test');
  });

  it('should not render items that are already selected', () => {
    const renderItem = function (item) {
      return (
        <div id={'item-'+item.id}>{item.name}</div>
      );
    };

    const wrapper = mount(<SmartSearch search={() => {}} results={results} cache={true} renderItem={renderItem} />);
    wrapper.find('#item-1').first().closest('.ss-item').simulate('click');
    expect(wrapper.state().selected).to.have.length(1);
    expect(wrapper.find('#item-1')).to.have.length(0);
  });

  it('highlights option selected with keyboard', () => {
    const wrapper = mount(<SmartSearch search={() => {}} results={results} cache={true} />);
    wrapper.find('input[type="text"]').simulate('click');
    wrapper.find('input[type="text"]').simulate('keyDown', {which:40});
    expect(wrapper.state().highlightIndex).to.equal(0);
  });

  it('should not select item when pressing enter key on highlightIndex -1', () => {
    const wrapper = mount(<SmartSearch search={() => {}} results={results} cache={true} />);
    wrapper.find('input[type="text"]').simulate('click');
    expect(wrapper.state().highlightIndex).to.equal(-1);
    wrapper.find('input[type="text"]').simulate('keyDown', {which:13});
    expect(wrapper.state().selected).to.have.length(0);
  });

  it('should select item when pressing enter on highlightIndex != -1', () => {
    const wrapper = mount(<SmartSearch search={() => {}} results={results} cache={true} />);
    wrapper.find('input[type="text"]').simulate('click');
    wrapper.find('input[type="text"]').simulate('keyDown', {which:40});
    wrapper.find('input[type="text"]').simulate('keyDown', {which:13});
    expect(wrapper.state().selected).to.have.length(1);
  });

  it('should close dropdown when pressing enter if searchable is false', () => {
    const wrapper = mount(<SmartSearch searchable={false} results={results} />);
    wrapper.setState({open: true});
    wrapper.find('input[type="text"]').simulate('keyDown', {which:13});
    expect(wrapper.state().open).to.equal(false);
  });

  it('should close dropdown when pressing esc if searchable is false', () => {
    const wrapper = mount(<SmartSearch searchable={false} results={results} />);
    wrapper.setState({open: true});
    wrapper.find('input[type="text"]').simulate('keyDown', {which:27});
    expect(wrapper.state().open).to.equal(false);
  });

  it('should not select item when pressing spacebar on highlightIndex -1', () => {
    const wrapper = mount(<SmartSearch search={() => {}} results={results} cache={true} />);
    wrapper.find('input[type="text"]').simulate('click');
    expect(wrapper.state().highlightIndex).to.equal(-1);
    wrapper.find('input[type="text"]').simulate('keyDown', {which:32});
    expect(wrapper.state().selected).to.have.length(0);
  });

  it('should toggle dropdown display when pressing spacebar if searchable is false', () => {
    const wrapper = mount(<SmartSearch searchable={false} results={results} />);
    wrapper.find('input[type="text"]').simulate('keyDown', {which:32});
    expect(wrapper.state().open).to.equal(true);
    wrapper.find('input[type="text"]').simulate('keyDown', {which:32});
    expect(wrapper.state().open).to.equal(false);
  });

  it('should select item when pressing spacebar on highlightIndex != -1', () => {
    const wrapper = mount(<SmartSearch search={() => {}} results={results} cache={true} />);
    wrapper.find('input[type="text"]').simulate('click');
    wrapper.find('input[type="text"]').simulate('keyDown', {which:40});
    wrapper.find('input[type="text"]').simulate('keyDown', {which:32});
    expect(wrapper.state().selected).to.have.length(1);
  });

  it('should handle and render pre-selected items', () => {
    const onRemove = sinon.spy();
    const selected = results[0].items;
    expect(selected).to.have.length(2);
    const wrapper = mount(<SmartSearch search={() => {}} selected={selected} results={results} onRemove={onRemove} cache={true} multi={true} />);
    expect(onRemove.callCount).to.equal(0);
    expect(wrapper.find('.ss-selected-item')).to.have.length(2);
    expect(wrapper.state().selected).to.equal(selected);
  });

  it('should handle multiple add and removes at a time with pre-selected items', () => {
    var renderSelectedItem = function(item, removeItem) {
      return (
        <div className="item">
          <span className="item-icon" onClick={removeItem}>×</span>
          <span className="item-label">Hello</span>
        </div>
      );
    }
    const onRemove = sinon.spy();
    const selected = results[0].items;
    expect(selected).to.have.length(2);
    const wrapper = mount(
      <SmartSearch
        search={() => {}}
        selected={selected}
        results={results}
        onRemove={onRemove}
        cache={true}
        multi={true}
        renderSelectedItem={renderSelectedItem}
      />
    );
    expect(wrapper.find('.ss-selected-item')).to.have.length(2);
    wrapper.find('.ss-selected-item .item-icon').first().simulate('click');
    expect(onRemove.callCount).to.equal(1);
    wrapper.find('.ss-item').first().simulate('click');
    wrapper.find('.ss-selected-item .item-icon').first().simulate('click');
    expect(onRemove.callCount).to.equal(2);
  });


  it('should update selected after mount', () => {
    const wrapper = mount(<SmartSearch selected={results[0].items} />);
    expect(wrapper.state().selected).to.have.length(results[0].items.length);
    wrapper.setProps({selected: results[1].items});
    expect(wrapper.state().selected).to.have.length(results[1].items.length);
  });

  it('should handle null results prop', () => {
    const wrapper = mount(<SmartSearch results={null} />);
    expect(wrapper.state().results).to.be.an('undefined');
  });

  it('should handle null selected prop', () => {
    const wrapper = mount(<SmartSearch selected={null} />);
    expect(wrapper.state().selected).to.be.an('array').and.have.length(0);
  });

  it('should open on key up or down if focused', () => {
    const wrapper = mount(<SmartSearch selected={null} />);
    wrapper.setState({focused: true});
    wrapper.find('input[type="text"]').simulate('keyDown', {which:38});
    expect(wrapper.state().open).to.equal(true);
    wrapper.setState({open: false});
    wrapper.find('input[type="text"]').simulate('keyDown', {which:40});
    expect(wrapper.state().open).to.equal(true);
  });

  it('should be open after you click on the input field with searchable=false', () => {
    var items = [
      {
        label: 'Schools',
        items: [{
          id: 1,
          name: 'place'
        },
        {
          id: 2,
          name: 'place 2'
        }]
    }];
    const wrapper = mount(
      <SmartSearch
        selected={null}
        multi={false}
        results={items}
        searchable={false} />
    );
    expect(wrapper.find('.ss-input input')).to.have.length(1);
    wrapper.find('.ss-input input').simulate('click');

    expect(wrapper.state().open).to.equal(true);

  });

});
