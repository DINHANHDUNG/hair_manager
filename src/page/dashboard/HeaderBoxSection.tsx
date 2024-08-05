import { Grid, Typography } from '@mui/material'
import { IconDots } from '@tabler/icons-react'
import * as React from 'react'
import { BoxIconSection } from './BoxIconSection'

export const HeaderBoxSection = ({
  icon,
  textTitle,
  colorBoxIcon,
  backgroundBoxIcon,
  hederRight
}: {
  icon?: React.ReactNode
  textTitle: string
  colorBoxIcon: string
  backgroundBoxIcon: string
  hederRight?: React.ReactNode
}) => {
  const renderTitleBox = (text: string) => {
    return (
      <Typography sx={{ fontWeight: '500', fontSize: 14 }} variant='subtitle1'>
        {text}
      </Typography>
    )
  }
  return (
    <Grid item container direction='row' alignItems='center' justifyContent='space-between'>
      <Grid item>
        <Grid item container direction='row' alignItems='center'>
          <BoxIconSection icon={icon} backgroundBoxIcon={backgroundBoxIcon} colorBoxIcon={colorBoxIcon} />
          {renderTitleBox(textTitle)}
        </Grid>
      </Grid>
      <Grid item direction='row' alignItems='center'>
        {hederRight ? hederRight : <IconDots stroke={1.5} size='1.3rem' color='gray' />}
      </Grid>
    </Grid>
  )
}
