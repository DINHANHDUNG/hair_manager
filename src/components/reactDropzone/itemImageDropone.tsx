import { Card } from '@mui/material'
import { Box } from '@mui/system'
import { RiDeleteBin7Line, RiDownloadCloud2Line, RiEyeLine, RiImageFill } from '@remixicon/react'
import React from 'react'
import { COLORS } from '../../common/colors'
interface ItemIMGDropzoneProps {
  image: File
}
const ItemIMGDropzone: React.FC<ItemIMGDropzoneProps> = ({ image }) => {
  return (
    <Card sx={{ mb: 1, boxShadow: 0 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1.5,
          px: 2,
          bgcolor: COLORS.gray,
          color: 'grey.800'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <RiImageFill size={18} style={{ marginRight: '10px' }} />
          {image.name}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <RiEyeLine size={18} style={{ marginRight: '10px', cursor: 'pointer' }} />
          <RiDownloadCloud2Line size={18} style={{ marginRight: '10px', cursor: 'pointer' }} />
          <RiDeleteBin7Line size={18} style={{ marginRight: '10px', cursor: 'pointer' }} />
        </Box>
      </Box>
    </Card>
  )
}

export default ItemIMGDropzone
