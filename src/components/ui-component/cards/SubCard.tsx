import React, { ReactNode, ForwardedRef } from 'react'

// material-ui
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// Define the prop types
interface SubCardProps {
  children?: ReactNode
  content?: boolean
  contentClass?: string
  darkTitle?: boolean
  secondary?: ReactNode
  sx?: object
  contentSX?: object
  title?: ReactNode
}

// ==============================|| CUSTOM SUB CARD ||============================== //

const SubCard = React.forwardRef(
  (
    {
      children,
      content = true,
      contentClass,
      darkTitle,
      secondary,
      sx = {},
      contentSX = {},
      title,
      ...others
    }: SubCardProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const defaultShadow = '0 2px 14px 0 rgb(32 40 45 / 8%)'

    return (
      <Card
        ref={ref}
        sx={{ border: '1px solid', borderColor: 'divider', ':hover': { boxShadow: defaultShadow }, ...sx }}
        {...others}
      >
        {/* card header and action */}
        {!darkTitle && title && (
          <CardHeader sx={{ p: 2.5 }} title={<Typography variant='h5'>{title}</Typography>} action={secondary} />
        )}
        {darkTitle && title && (
          <CardHeader sx={{ p: 2.5 }} title={<Typography variant='h4'>{title}</Typography>} action={secondary} />
        )}

        {/* content & header divider */}
        {title && <Divider />}

        {/* card content */}
        {content && (
          <CardContent sx={{ p: 2.5, ...contentSX }} className={contentClass || ''}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    )
  }
)

// Add prop types validation for JavaScript users
// SubCard.propTypes = {
//   children: PropTypes.node,
//   content: PropTypes.bool,
//   contentClass: PropTypes.string,
//   darkTitle: PropTypes.bool,
//   secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
//   sx: PropTypes.object,
//   contentSX: PropTypes.object,
//   title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object])
// };

export default SubCard
