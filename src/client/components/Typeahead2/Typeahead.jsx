import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  BLACK,
  BLUE,
  FOCUS_COLOUR,
  GREY_1,
  GREY_2,
  RED,
  TEXT_COLOUR,
  WHITE,
} from 'govuk-colours'
import { FOCUSABLE, SPACING } from '@govuk-react/constants'
import Label from '@govuk-react/label'
import multiInstance from '../../utils/multiinstance'

import {
  TYPEAHEAD__BLUR,
  TYPEAHEAD__SET_ACTIVE_OPTION,
  TYPEAHEAD__INPUT,
  TYPEAHEAD__INITIALISE,
  TYPEAHEAD__MENU_CLOSE,
  TYPEAHEAD__MENU_OPEN,
  TYPEAHEAD__OPTION_MOUSE_DOWN,
  TYPEAHEAD__OPTION_TOGGLE,
  TYPEAHEAD__OPTION_REMOVE,
} from '../../actions'

import Highlighter from '../Typeahead/Highlighter'
import AssistiveText from './AssistiveText'
import SelectedChips from './SelectedChips'
import {
  getActionFromKey,
  getFilteredOptions,
  getUpdatedIndex,
  maintainScrollVisibility,
  menuActions,
} from './utils'
import reducer from './reducer'

const ListboxOption = styled('div')((props) => ({
  display: 'flex',
  padding: props.isMulti
    ? `${SPACING.SCALE_3} 0 ${SPACING.SCALE_3} 48px`
    : SPACING.SCALE_3,
  borderBottom: `solid 1px ${GREY_2}`,
  position: 'relative',
  boxSizing: 'border-box',
  minHeight: 53,
  alignItems: 'center',
  cursor: 'pointer',
  backgroundColor: props.active ? BLUE : WHITE,
  color: props.active ? WHITE : TEXT_COLOUR,

  '&:last-child': {
    borderBottom: 'none',
  },
  '::before': {
    content: props.isMulti ? '""' : '',
    position: 'absolute',
    left: 10,
    top: 'calc(50% - 14px)',
    width: 26,
    height: 26,
    backgroundColor: WHITE,
    boxSizing: 'border-box',
    border: `solid 2px ${TEXT_COLOUR}`,
    outline: props.focussed ? `3px solid ${FOCUS_COLOUR}` : 'none',
    outlineOffset: 0,
  },
  '::after': {
    display: props['aria-selected'] ? 'block' : 'none',
    content: props.isMulti ? '""' : '',
    position: 'absolute',
    left: 19,
    top: 'calc(50% - 3px)',
    width: 5,
    height: 14,
    borderRight: `3px solid ${TEXT_COLOUR}`,
    borderBottom: `3px solid ${TEXT_COLOUR}`,
    transform: 'translate(0, -50%) rotate(45deg)',
  },
}))

const NoOptionsMessage = styled('div')({
  padding: `${SPACING.SCALE_3} 0`,
  boxSizing: 'border-box',
  minHeight: 53,
  textAlign: 'center',
  color: GREY_1,
})

const InputWrapper = styled('div')({
  position: 'relative',

  '&::after': {
    borderBottom: `2px solid ${BLACK}`,
    borderRight: `2px solid ${BLACK}`,
    content: '""',
    display: 'block',
    height: 12,
    pointerEvents: 'none',
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: 'translate(0, -65%) rotate(45deg)',
    width: 12,
  },
})

const AutocompleteInput = styled('input')(({ error }) => ({
  backgroundColor: WHITE,
  boxSizing: 'border-box',
  border: error ? `4px solid ${RED}` : `2px solid ${BLACK}`,
  display: 'block',
  fontSize: '1em',
  padding: '8px 12px 10px',
  textAlign: 'left',
  width: '100%',
  ...FOCUSABLE,
}))

const Menu = styled('div')(({ open }) => ({
  visibility: open ? 'visible' : 'hidden',
  backgroundColor: WHITE,
  boxSizing: 'border-box',
  border: `1px solid ${BLACK}`,
  maxHeight: 318,
  overflowY: 'scroll',
  left: 0,
  position: 'absolute',
  top: '100%',
  width: '100%',
  zIndex: 100,
}))

const Typeahead = ({
  name,
  label = '',
  error = false,
  closeMenuOnSelect = false,
  isMulti = false,
  defaultValue,
  value,
  menuOpen,
  options = [],
  input = '',
  selectedOptions = [],
  activeIndex,
  focusIndex,
  onInitialise,
  onBlur,
  onActiveChange,
  onInput,
  onOptionMouseDown,
  onOptionToggle,
  onOptionRemove,
  onMenuClose,
  onMenuOpen,
  'data-test': testId,
  ...inputProps
}) => {
  onInitialise({ options, isMulti, value: value || defaultValue })
  const inputRef = React.useRef(null)
  const menuRef = React.useRef(null)
  const ignoreFilter =
    !isMulti && selectedOptions.map(({ label }) => label).includes(input)
  const filteredOptions = getFilteredOptions({
    options,
    input: !ignoreFilter && input,
  })
  const activeId =
    menuOpen && filteredOptions[activeIndex]
      ? `${name}-${filteredOptions[activeIndex].value}`
      : ''
  const scrollMenuToIndex = (index) =>
    maintainScrollVisibility({
      parent: menuRef.current,
      target: menuRef.current.children[index],
    })
  const onInputKeyDown = (event) => {
    const max = filteredOptions.length - 1
    const action = getActionFromKey(event.code, menuOpen)
    switch (action) {
      case menuActions.next:
      case menuActions.last:
      case menuActions.first:
      case menuActions.previous:
        event.preventDefault()
        const newActiveIndex = getUpdatedIndex(activeIndex, max, action)
        onActiveChange(newActiveIndex)
        scrollMenuToIndex(newActiveIndex)
        return
      case menuActions.closeSelect:
        event.preventDefault()
        if (filteredOptions[activeIndex]) {
          onOptionToggle(filteredOptions[activeIndex])
        }
        if (closeMenuOnSelect) {
          onMenuClose()
        }
        return
      case menuActions.close:
        event.preventDefault()
        onMenuClose()
        return
      case menuActions.open:
        onMenuOpen()
        scrollMenuToIndex(activeIndex)
        return
    }
  }
  return (
    <div id={name} data-test={testId}>
      <Label id={`${name}-label`} data-test="typeahead-label">
        {label}
      </Label>
      {isMulti && Boolean(selectedOptions.length) && (
        <SelectedChips
          name={name}
          selectedOptions={selectedOptions}
          onOptionRemove={onOptionRemove}
        />
      )}
      <InputWrapper>
        <AutocompleteInput
          {...inputProps}
          autoComplete="off"
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          aria-controls={`${name}-listbox`}
          aria-expanded={menuOpen ? 'true' : 'false'}
          aria-haspopup="listbox"
          aria-labelledby={`${name}-label ${name}-selected`}
          role="combobox"
          type="text"
          value={input}
          onBlur={onBlur}
          onClick={() => {
            onMenuOpen()
            scrollMenuToIndex(activeIndex)
          }}
          onInput={onInput}
          onKeyDown={onInputKeyDown}
          error={error}
          ref={inputRef}
          data-test="typeahead-input"
        />
        <Menu
          id={`${name}-listbox`}
          open={menuOpen}
          role="listbox"
          aria-labelledby={`${name}-label`}
          aria-multiselectable="true"
          ref={menuRef}
          data-test="typeahead-menu"
        >
          {filteredOptions.map((option, index) => (
            <ListboxOption
              id={`${name}-${option.value}`}
              key={option.value}
              active={index === activeIndex}
              focussed={index === focusIndex}
              isMulti={isMulti}
              role="option"
              aria-selected={selectedOptions.indexOf(option) > -1}
              aria-setsize={filteredOptions.length}
              aria-posinset={index}
              onClick={() => {
                inputRef.current && inputRef.current.focus()
                onOptionToggle(option)
                if (closeMenuOnSelect) {
                  onMenuClose()
                }
              }}
              onMouseMove={() => {
                onActiveChange(index)
              }}
              onMouseDown={() => {
                onOptionMouseDown(index)
              }}
              data-test="typeahead-menu-option"
            >
              <span>
                <Highlighter optionLabel={option.label} searchStr={input} />
              </span>
            </ListboxOption>
          ))}
          {!filteredOptions.length && (
            <NoOptionsMessage>No Options</NoOptionsMessage>
          )}
        </Menu>
      </InputWrapper>
      <AssistiveText name={name} />
    </div>
  )
}

const keyPairPropType = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.string,
})

Typeahead.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.bool,
  closeMenuOnSelect: PropTypes.bool,
  isMulti: PropTypes.bool,
  defaultValue: PropTypes.oneOfType([
    keyPairPropType,
    PropTypes.arrayOf(keyPairPropType),
  ]),
  value: PropTypes.oneOfType([
    keyPairPropType,
    PropTypes.arrayOf(keyPairPropType),
  ]),
  menuOpen: PropTypes.bool,
  options: PropTypes.arrayOf(keyPairPropType),
  input: PropTypes.string,
  selectedOptions: PropTypes.arrayOf(keyPairPropType),
  activeIndex: PropTypes.number,
  focusIndex: PropTypes.number,
  onInitialise: PropTypes.func,
  onBlur: PropTypes.func,
  onActiveChange: PropTypes.func,
  onInput: PropTypes.func,
  onOptionMouseDown: PropTypes.func,
  onOptionToggle: PropTypes.func,
  onOptionRemove: PropTypes.func,
  onMenuClose: PropTypes.func,
  onMenuOpen: PropTypes.func,
}

export default multiInstance({
  name: 'Typeahead',
  actionPattern: 'TYPEAHEAD__',
  dispatchToProps: (dispatch) => ({
    onInitialise: ({ options, isMulti, value }) => {
      dispatch({
        type: TYPEAHEAD__INITIALISE,
        options,
        isMulti,
        value,
      })
    },
    onBlur: () => {
      dispatch({
        type: TYPEAHEAD__BLUR,
      })
    },
    onActiveChange: (activeIndex) => {
      dispatch({
        type: TYPEAHEAD__SET_ACTIVE_OPTION,
        activeIndex,
      })
    },
    onInput: (event) => {
      dispatch({
        type: TYPEAHEAD__INPUT,
        input: event.target.value,
      })
    },
    onMenuClose: () => {
      dispatch({
        type: TYPEAHEAD__MENU_CLOSE,
      })
    },
    onMenuOpen: () => {
      dispatch({
        type: TYPEAHEAD__MENU_OPEN,
      })
    },
    onOptionMouseDown: (focusIndex) => {
      dispatch({
        type: TYPEAHEAD__OPTION_MOUSE_DOWN,
        focusIndex,
      })
    },
    onOptionToggle: (option) => {
      dispatch({
        type: TYPEAHEAD__OPTION_TOGGLE,
        option,
      })
    },
    onOptionRemove: (option) => {
      dispatch({
        type: TYPEAHEAD__OPTION_REMOVE,
        option,
      })
    },
  }),
  component: Typeahead,
  reducer,
})
