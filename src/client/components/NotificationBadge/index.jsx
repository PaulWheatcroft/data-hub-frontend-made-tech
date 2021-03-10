import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { RED, WHITE } from 'govuk-colours'
import { FONT_SIZE } from '@govuk-react/constants'

const StyledNotificationSpan = styled('span')`
  font-size: ${FONT_SIZE.SIZE_16};
  font-weight: 600;
  color: ${WHITE};
  display: inline-block;
  min-width: 15px;
  padding: 5px 8px 2px 8px;
  border-radius: 75px;
  background-color: ${RED};
  text-align: center;
  white-space: nowrap;
  text-decoration: none;
`

const NotificationBadge = ({ label = '' }) => (
  <StyledNotificationSpan aria-label={label}>{label}</StyledNotificationSpan>
)

NotificationBadge.propTypes = {
  label: PropTypes.string,
}

export default NotificationBadge
