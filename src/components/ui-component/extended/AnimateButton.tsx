import React, { ForwardedRef, ReactNode } from 'react'

// third-party
import { motion, useCycle } from 'framer-motion'

// Define the prop types
interface AnimateButtonProps {
  children: ReactNode
  offset?: number
  type?: 'slide' | 'scale' | 'rotate'
  direction?: 'up' | 'down' | 'left' | 'right'
  scale?: number | { hover: number; tap: number }
}

// ==============================|| ANIMATION BUTTON ||============================== //

const AnimateButton = React.forwardRef<HTMLDivElement, AnimateButtonProps>(
  (
    { children, type = 'scale', direction = 'right', offset = 10, scale = { hover: 1, tap: 0.9 } },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    let offset1: number
    let offset2: number
    switch (direction) {
      case 'up':
      case 'left':
        offset1 = offset
        offset2 = 0
        break
      case 'right':
      case 'down':
      default:
        offset1 = 0
        offset2 = offset
        break
    }

    const [x, cycleX] = useCycle(offset1, offset2)
    const [y, cycleY] = useCycle(offset1, offset2)

    switch (type) {
      case 'rotate':
        return (
          <motion.div
            ref={ref}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 2,
              repeatDelay: 0
            }}
          >
            {children}
          </motion.div>
        )
      case 'slide':
        if (direction === 'up' || direction === 'down') {
          return (
            <motion.div ref={ref} animate={{ y }} onHoverEnd={() => cycleY()} onHoverStart={() => cycleY()}>
              {children}
            </motion.div>
          )
        }
        return (
          <motion.div ref={ref} animate={{ x }} onHoverEnd={() => cycleX()} onHoverStart={() => cycleX()}>
            {children}
          </motion.div>
        )

      case 'scale':
      default:
        if (typeof scale === 'number') {
          scale = {
            hover: scale,
            tap: scale
          }
        }
        return (
          <motion.div ref={ref} whileHover={{ scale: scale.hover }} whileTap={{ scale: scale.tap }}>
            {children}
          </motion.div>
        )
    }
  }
)

// Add prop types validation for JavaScript users
// AnimateButton.propTypes = {
//   children: PropTypes.node.isRequired,
//   offset: PropTypes.number,
//   type: PropTypes.oneOf(['slide', 'scale', 'rotate']),
//   direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),
//   scale: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
// };

// AnimateButton.defaultProps = {
//   type: 'scale',
//   offset: 10,
//   direction: 'right',
//   scale: {
//     hover: 1,
//     tap: 0.9
//   }
// };

export default AnimateButton
