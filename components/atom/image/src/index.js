import React, {Component} from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import memoize from 'memoize-one'

import {htmlImgProps} from './types'
import {ImageNotFoundIcon} from './defaults'

const defaultErrorText = 'Image not found'
const BASE_CLASS = 'sui-AtomImage'

const Error = (
  {className, icon: Icon, text} // eslint-disable-line react/prop-types
) => (
  <div className={className}>
    {Icon && <Icon />}
    <p>{text}</p>
  </div>
)

class AtomImage extends Component {
  state = {
    loading: true,
    error: false
  }

  getClassNames = memoize((loading, error, className) => {
    return cx(
      BASE_CLASS,
      className,
      `is-${loading ? 'loading' : 'loaded'}`,
      error && `is-error`
    )
  })

  getClassNamesFigure = memoize((placeholder, skeleton) => {
    const BASE_CLASS_FIGURE = `${BASE_CLASS}-figure`
    return cx(
      `${BASE_CLASS_FIGURE}`,
      placeholder && `${BASE_CLASS_FIGURE}--placeholder`,
      skeleton && `${BASE_CLASS_FIGURE}--skeleton`
    )
  })

  handleLoad = () => {
    const {onLoad} = this.props
    this.setState({loading: false})
    onLoad && onLoad()
  }

  handleError = () => {
    const {onError} = this.props
    this.setState({
      error: true,
      loading: false
    })
    onError && onError()
  }

  render() {
    const {
      className,
      placeholder,
      skeleton,
      bgStyles,
      spinner: Spinner,
      errorIcon,
      errorText,
      onError,
      onLoad,
      ...imgProps
    } = this.props

    const {loading, error} = this.state

    const classNames = this.getClassNames(loading, error, className)
    const classNamesFigure = this.getClassNamesFigure(placeholder, skeleton)

    const figureStyles = {
      backgroundImage: `url(${placeholder || skeleton})`
    }

    return (
      <div className={classNames}>
        <figure
          className={classNamesFigure}
          style={!error && (placeholder || skeleton) ? figureStyles : {}}
        >
          <img
            className={`${BASE_CLASS}-image`}
            onLoad={this.handleLoad}
            onError={this.handleError}
            {...imgProps}
          />
        </figure>
        {!error &&
          loading &&
          Spinner && <Spinner className={`${BASE_CLASS}-spinner`} />}
        {error && (
          <Error
            className={`${BASE_CLASS}-error`}
            icon={errorIcon}
            text={errorText}
          />
        )}
      </div>
    )
  }
}

AtomImage.displayName = 'AtomImage'
AtomImage.propTypes = {
  /** Image url or base64 */
  src: PropTypes.string.isRequired,

  /** Description of the image */
  alt: PropTypes.string.isRequired,

  /** Image displayed (blurred) while the final image is being loaded */
  placeholder: PropTypes.string,

  /** Image (wireframe, skeleton) displayed (not blurred) while the final image is being loaded */
  skeleton: PropTypes.string,

  /** Spinner (component) displayed while the final image is being loaded */
  spinner: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),

  /** Icon (component) to be displayed in an Error Box when the image cannot be loaded */
  errorIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),

  /** Text to be displayed in an Error Box when the image cannot be loaded */
  errorText: PropTypes.string,

  /** Function to be called when the image cannot be loaded  */
  onError: PropTypes.func,

  /** Function to be called when the image completed its loading  */
  onLoad: PropTypes.func,

  /** <img> props */
  ...htmlImgProps
}

AtomImage.defaultProps = {
  errorIcon: ImageNotFoundIcon,
  errorText: defaultErrorText
}

export default AtomImage
