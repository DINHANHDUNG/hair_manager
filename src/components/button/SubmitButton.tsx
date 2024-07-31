// SubmitButton.tsx
import React from 'react'
import Button, { ButtonProps } from '@mui/material/Button'

// Định nghĩa kiểu cho props của SubmitButton
interface SubmitButtonProps extends ButtonProps {
  loading?: boolean // Ví dụ về một prop tùy chỉnh
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ loading, children, ...props }) => {
  return (
    <Button
      {...props}
      type='submit' // Đảm bảo button có type là "submit"
      disabled={loading || props.disabled} // Disable button khi loading hoặc disabled
    >
      {loading ? 'Loading...' : children}
    </Button>
  )
}

export default SubmitButton
