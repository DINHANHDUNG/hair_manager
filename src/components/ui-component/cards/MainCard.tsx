import React, { ReactNode, ForwardedRef } from 'react'

// material-ui
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// constant
const headerSX = {
  '& .MuiCardHeader-action': { mr: 0 }
}

// Define the prop types
interface MainCardProps {
  border?: boolean
  boxShadow?: boolean
  children?: ReactNode
  content?: boolean
  contentClass?: string
  contentSX?: object
  darkTitle?: boolean
  secondary?: ReactNode
  shadow?: string | number
  sx?: object
  title?: ReactNode
  elevation?: number
}

// ==============================|| CUSTOM MAIN CARD ||============================== //

const MainCard = React.forwardRef<HTMLDivElement, MainCardProps>(
  (
    {
      border = false,
      boxShadow,
      children,
      content = true,
      contentClass = '',
      contentSX = {},
      darkTitle,
      secondary,
      shadow,
      sx = {},
      title,
      ...others
    }: MainCardProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <Card
        ref={ref}
        {...others}
        sx={{
          border: border ? '1px solid' : 'none',
          borderColor: 'divider',
          ':hover': {
            boxShadow: boxShadow ? shadow || '0 2px 14px 0 rgb(32 40 45 / 8%)' : 'inherit'
          },
          ...sx
        }}
      >
        {/* card header and action */}
        {!darkTitle && title && <CardHeader sx={headerSX} title={title} action={secondary} />}
        {darkTitle && title && (
          <CardHeader sx={headerSX} title={<Typography variant='h3'>{title}</Typography>} action={secondary} />
        )}

        {/* content & header divider */}
        {title && <Divider />}

        {/* card content */}
        {content && (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    )
  }
)

// Add prop types validation for JavaScript users
// MainCard.propTypes = {
//   border: PropTypes.bool,
//   boxShadow: PropTypes.bool,
//   children: PropTypes.node,
//   content: PropTypes.bool,
//   contentClass: PropTypes.string,
//   contentSX: PropTypes.object,
//   darkTitle: PropTypes.bool,
//   secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
//   shadow: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   sx: PropTypes.object,
//   title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object])
// };

export default MainCard
