import React from 'react';

import ArrowIcon from './ArrowIcon';
import DefaultItemComponent from './DefaultItemComponent';
import DefaultValueComponent from './DefaultValueComponent';
import './style.css';

class Select extends React.Component {
  static defaultProps = {
    valueComponent: DefaultValueComponent,
    iconComponent: ArrowIcon,
    itemComponent: DefaultItemComponent,
    items: [],
    onChange: () => {},
    multiple: false,
  };

  state = {
    itemContainerBox: {},
    opened: false,
    selected: [],
  };

  componentDidMount() {
    window.addEventListener('scroll', this.setItemsConteinerBox);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.setItemsConteinerBox);
  }

  getItemsContainerBox = () => {
    if (!this.rootElement || !this.itemsContainerElement) {
      return;
    }
    const rootElementBoundery = this.rootElement.getBoundingClientRect();
    const itemsContainerElementBoundery = this.itemsContainerElement.getBoundingClientRect();
    const left = rootElementBoundery.left;
    const bottom =
      rootElementBoundery.top + this.itemsContainerElement.offsetHeight;
    const top =
      bottom > window.innerHeight
        ? rootElementBoundery.bottom - this.itemsContainerElement.offsetHeight
        : rootElementBoundery.top;
    return {
      width: `${this.rootElement.offsetWidth}px`,
      left: `${left}px`,
      top: `${top}px`,
    };
  };

  setItemsConteinerBox = () => {
    const itemContainerBox = this.getItemsContainerBox();
    this.setState({
      itemContainerBox,
    });
  };

  closeItemsContainer = () => {
    this.setState({
      opened: false,
    });
    if (this.props.multiple) {
      this.props.onChange(this.state.selected);
    }
  };

  openItemsContainer = () => {
    this.setState(
      state => ({
        opened: true,
      }),
      this.setItemsConteinerBox,
    );
  };

  select = item => {
    const hasSelected = this.state.selected.includes(item);
    this.setState(state => ({
      selected: hasSelected
        ? state.selected.filter(i => i !== item)
        : [...state.selected, item],
    }));
  };

  onItemChose = item => event => {
    if (this.props.multiple) {
      event.preventDefault();
      event.stopPropagation();
      this.select(item);
    } else {
      this.props.onChange(item);
    }
  };

  isActive = item => {
    if (this.props.multiple) {
      return this.state.selected.includes(item);
    }
    return item === this.props.value;
  };

  renderItemsContainer = () => {
    const { itemComponent: ItemComponent } = this.props;
    return (
      <div
        className="mui-select-items-container-wrapper"
        onClick={this.closeItemsContainer}
      >
        <div
          className="mui-select-items-container"
          ref={itemsContainer => {
            this.itemsContainerElement = itemsContainer;
          }}
          style={this.state.itemContainerBox}
        >
          <ul className="mui-select-items-list">
            {this.props.items.map((item, index) => (
              <li
                className={`mui-select-list-item ${
                  this.isActive(item) ? 'active' : ''
                }`}
                key={index}
                onClick={this.onItemChose(item)}
              >
                <ItemComponent value={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  render() {
    const {
      style,
      value,
      valueComponent: ValueComponent,
      iconComponent: IconComponent,
    } = this.props;
    const { opened } = this.state;
    return (
      <React.Fragment>
        <div
          className="mui-select-root"
          style={style}
          ref={root => {
            this.rootElement = root;
          }}
        >
          <div className="mui-select-value" onClick={this.openItemsContainer}>
            <ValueComponent value={value} />
          </div>
          <button
            className="mui-select-arrow-button"
            onClick={this.openItemsContainer}
          >
            <IconComponent />
          </button>
        </div>
        {opened && this.renderItemsContainer()}
      </React.Fragment>
    );
  }
}

export default Select;
