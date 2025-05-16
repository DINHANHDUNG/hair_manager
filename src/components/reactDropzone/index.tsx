import { Fab } from '@mui/material'
import FormHelperText from '@mui/material/FormHelperText'
import { SxProps } from '@mui/material/styles'
import { RiUploadCloud2Line } from '@remixicon/react'
import React from 'react'
import { useDropzone } from 'react-dropzone'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { COLORS } from '../../common/colors'
import Toast from '../toast'
import { FILE_ACCEPT_TYPES } from '../../common/contants'

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ReactDropzoneProps {
  control?: Control<any> // Đối tượng điều khiển từ react-hook-form
  name?: string // Tên trường
  onDropCallback?: (files: File[]) => void // Callback khi có file được thả
  errors?: FieldErrors<any> // Lỗi từ react-hook-form
  mb?: number // Khoảng cách phía dưới (tùy chọn)
  sx?: SxProps // Tùy chọn style bổ sung cho dropzone
  disabled?: boolean // Prop để disable dropzone
  maxImage: number
  accept?: Record<string, string[]> // Định dạng file được chấp nhận
}
/* eslint-enable @typescript-eslint/no-explicit-any */
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FORMATS = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel'
]

const ReactDropzone: React.FC<ReactDropzoneProps> = ({
  control,
  name = '',
  onDropCallback,
  errors,
  mb = 1,
  disabled,
  maxImage,
  accept
}) => {
  // const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // const downloadImage = (link: string) => {
  //   saveAs(link, 'image.jpg') // Put your image URL here.
  // }

  const { getRootProps, getInputProps } = useDropzone({
    accept: accept ? accept : FILE_ACCEPT_TYPES.images,
    maxSize: MAX_SIZE,
    onDrop: (acceptedFiles) => {
      if (disabled) return
      if (acceptedFiles.length > maxImage) {
        Toast({
          text: `Chỉ được chọn tối đa ${maxImage} ảnh`,
          variant: 'error'
        })
        return false
      }
      const validFiles = acceptedFiles.filter((file) => {
        if (!ACCEPTED_FORMATS.includes(file.type)) {
          Toast({
            text: `File ${file.name} không phải là định dạng được hỗ trợ.`,
            variant: 'error'
          })
          return false
        }
        if (file.size > MAX_SIZE) {
          Toast({
            text: `File ${file.name} vượt quá dung lượng cho phép là 5MB.`,
            variant: 'error'
          })
          return false
        }

        return true
      })
      //upload ảnh lên server => trả về link gắn vào setSelectedFiles
      // Cập nhật state với các file hợp lệ mới
      // const updatedFiles = [...selectedFiles, ...validFiles]
      // setSelectedFiles(validFiles)

      // Callback và cập nhật giá trị của react-hook-form
      if (onDropCallback) onDropCallback(validFiles)
    },
    disabled
  })

  // const deleteFile = (fileToDelete: File, onChange: (value: File[]) => void) => {
  //   const updatedFiles = selectedFiles.filter((file) => file !== fileToDelete)
  //   setSelectedFiles(updatedFiles)
  //   onChange(updatedFiles) // Cập nhật giá trị cho react-hook-form
  //   if (onDropCallback) onDropCallback(updatedFiles)
  // }

  return (
    <Controller
      control={control}
      name={name || ''}
      render={() => {
        // render={({ field: { onChange, value } }) => {
        // useEffect(() => {
        //   onChange(selectedFiles)
        // }, [selectedFiles, onChange])
        return (
          <>
            <div style={{ marginBottom: '20px' }}>
              <div
                {...getRootProps({ className: 'dropzone' })}
                // style={{
                //   border: '1px dashed #D3D3D3',
                //   padding: '20px',
                //   borderRadius: '8px',
                //   textAlign: 'center',
                //   alignItems: 'center',
                //   color: '#6c757d',
                //   cursor: disabled ? 'default' : 'pointer',
                //   opacity: disabled ? 0.5 : 1 // Thay đổi opacity khi disabled
                //   // ...sx
                // }}
                style={{
                  minHeight: '160px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  border: '1px dashed #D3D3D3',
                  padding: '20px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  alignItems: 'center',
                  color: '#6c757d',
                  cursor: disabled ? 'default' : 'pointer',
                  opacity: disabled ? 0.5 : 1
                }}
              >
                <input {...getInputProps()} />
                <Fab disabled aria-label='like' size='medium' style={{ backgroundColor: COLORS.gray }} sx={{ mb: 2 }}>
                  <RiUploadCloud2Line size={20} color={COLORS.textInput} />
                </Fab>

                <p style={{ fontSize: '14px', fontWeight: '400', color: COLORS.textInput }}>
                  Kéo và thả ảnh vào đây hoặc bấm để chọn ảnh{' '}
                </p>
                <p style={{ fontSize: '12px', fontWeight: '300' }}>(Hỗ trợ .jpg, .png, .pdf, tối đa 5MB)</p>
              </div>
              {errors && errors[name]?.message && (
                <FormHelperText sx={{ mt: 0.5, mb }}>{String(errors[name]?.message)}</FormHelperText>
              )}
            </div>
            {/* {value &&
              value.length > 0 &&
              value.map((file: File) => (
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
                      {file.name}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <RiEyeLine size={18} style={{ marginRight: '10px', cursor: 'pointer' }} />
                      <RiDownloadCloud2Line
                        onClick={() => downloadImage('')}
                        size={18}
                        style={{ marginRight: '10px', cursor: 'pointer' }}
                      />
                      <RiDeleteBin7Line
                        onClick={() => deleteFile(file, onChange)}
                        size={18}
                        style={{ marginRight: '10px', cursor: 'pointer' }}
                      />
                    </Box>
                  </Box>
                </Card>
              ))} */}
          </>
        )
      }}
    />
  )
}

export default ReactDropzone
