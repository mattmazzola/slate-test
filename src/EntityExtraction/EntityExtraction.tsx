import { Editor } from 'slate-react'
import { Value } from 'slate'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import initialValue from './value'
import './EntityExtraction.css'


const root = window.document.querySelector('main')

/**
 * The menu.
 *
 * @type {Component}
 */

interface MenuProps {
    menuRef: any
    value: any
    onChange: any
}

class Menu extends React.Component<MenuProps> {

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark(type: any) {
    const { value }: any = this.props
    return value.activeMarks.some((mark: any) => mark.type == type)
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark(event: any, type: string) {
    const { value, onChange } = this.props
    event.preventDefault()
    const change = value.change().toggleMark(type)
    onChange(change)
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton(type: any, icon: any) {
    const isActive = this.hasMark(type)
    const onMouseDown = (event: any) => this.onClickMark(event, type)

    return (
      <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    )
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      ReactDOM.createPortal(
        <div className="menu hover-menu" ref={this.props.menuRef}>
          {this.renderMarkButton('bold', 'format_bold')}
          {this.renderMarkButton('italic', 'format_italic')}
          {this.renderMarkButton('underlined', 'format_underlined')}
          {this.renderMarkButton('code', 'code')}
        </div>,
        root!
      )
    )
  }

}


/**
 * The hovering menu example.
 *
 * @type {Component}
 */

interface State {
    value: any
}

class HoveringMenu extends React.Component<any, State> {
    menu: HTMLElement

  /**
   * Deserialize the raw initial value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue)
  }

  /**
   * On update, update the menu.
   */

  componentDidMount() {
    this.updateMenu()
  }

  componentDidUpdate() {
    this.updateMenu()
  }

  /**
   * Update the menu's absolute position.
   */

  updateMenu = () => {
    const { value } = this.state
    const menu = this.menu
    if (!menu) return

    if (value.isBlurred || value.isEmpty) {
      menu.removeAttribute('style')
      return
    }

    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    menu.style.opacity = '1'
    menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`
    menu.style.left = `${rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2}px`
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = ({ value }: any) => {
    this.setState({ value })
  }

  /**
   * Save the `menu` ref.
   *
   * @param {Menu} menu
   */

  menuRef = (menu: any) => {
    this.menu = menu
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <div>
        <Menu
          menuRef={this.menuRef}
          value={this.state.value}
          onChange={this.onChange}
        />
        <div className="editor">
          <Editor
            placeholder="Enter some text..."
            value={this.state.value}
            onChange={this.onChange}
            renderMark={this.renderMark}
          />
        </div>
      </div>
    )
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = (props: any): React.ReactNode | void => {
    const { children, mark } = props
    switch (mark.type) {
      case 'bold': return <strong>{children}</strong>
      case 'code': return <code>{children}</code>
      case 'italic': return <em>{children}</em>
      case 'underlined': return <u>{children}</u>
    }
  }

}

/**
 * Export.
 */

export default HoveringMenu