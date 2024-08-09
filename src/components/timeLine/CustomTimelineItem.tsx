import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
// import { SvgIcon, SvgIconProps } from '@mui/material'
import TripOriginIcon from '@mui/icons-material/TripOrigin'
import { Box } from '@mui/system'
import * as React from 'react'
import { COLORS } from '../../common/colors'

// Icon hình tròn có lỗ ở giữa
// function CircleIcon(props: SvgIconProps) {
//   return (
//     <SvgIcon {...props}>
//       <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none' />
//     </SvgIcon>
//   )
// }

type TimelineItemProps = {
  leftContent: React.ReactNode | string
  rightContent: React.ReactNode | string
  icon?: React.ReactElement
}

export const CustomTimelineItem: React.FC<TimelineItemProps> = ({ leftContent, rightContent, icon }) => (
  <TimelineItem>
    <TimelineOppositeContent color='textSecondary'>{leftContent}</TimelineOppositeContent>
    <TimelineSeparator>
      <Box sx={{ mt: 1, mb: 1 }}>{icon || <TripOriginIcon sx={{ color: COLORS.bgButton }} />}</Box>
      <TimelineConnector />
    </TimelineSeparator>
    <TimelineContent>{rightContent}</TimelineContent>
  </TimelineItem>
)
