import { Grid, Typography } from '@mui/material'
import MuiTypography from '@mui/material/Typography'
import * as React from 'react'

export const FooterBoxSection = ({
  elementLeft,
  elementRight,
  colorRight,
  handleValueLeft
}: {
  elementLeft: React.ReactNode | string
  elementRight?: React.ReactNode | string
  colorRight?: string
  handleValueLeft?: () => void
}) => {
  return (
    <Grid item container direction='row' alignItems='center' justifyContent='space-between' sx={{ mt: 1 }}>
      <span style={{ cursor: 'pointer' }} onClick={handleValueLeft}>
        <Typography sx={{ fontWeight: '700', fontSize: 30 }} variant='subtitle1'>
          {elementLeft}
        </Typography>
      </span>

      <MuiTypography
        sx={{ fontWeight: '500', fontSize: 20, mb: 0 }}
        color={colorRight || 'primary'}
        variant='h6'
        gutterBottom
      >
        {elementRight}
      </MuiTypography>
    </Grid>
  )
}

export const FooterBoxSection2 = ({
  elementLeft,
  elementRight,
  colorRight,
  handleValueLeft
}: {
  elementLeft: React.ReactNode | string
  elementRight: React.ReactNode | string
  colorRight?: string
  handleValueLeft?: () => void
}) => {
  return (
    <Grid item container direction='row' alignItems='center' justifyContent='space-between' sx={{ mt: 0.5 }}>
      <span style={{ cursor: 'pointer' }} onClick={handleValueLeft}>
        <Typography sx={{ fontWeight: '700', fontSize: 13 }} variant='subtitle1'>
          {elementLeft}
        </Typography>
      </span>
      <MuiTypography
        sx={{ fontWeight: '500', fontSize: 10, mb: 0 }}
        color={colorRight || 'primary'}
        variant='h6'
        gutterBottom
      >
        {elementRight}
      </MuiTypography>
    </Grid>
  )
}
