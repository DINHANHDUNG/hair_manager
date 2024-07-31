// MyButton.tsx
import React from 'react'
import Button, { ButtonProps } from '@mui/material/Button'

// Định nghĩa kiểu cho props của MyButton
interface MyButtonProps extends ButtonProps {
  // Bạn có thể thêm các props tùy chỉnh khác ở đây nếu cần
  loading?: boolean // Ví dụ về một prop tùy chỉnh
}

const MyButton: React.FC<MyButtonProps> = ({ loading, children, ...props }) => {
  return (
    <Button
      {...props}
      disabled={loading || props.disabled} // Disable button khi loading
    >
      {loading ? 'Loading...' : children}
    </Button>
  )
}

export default MyButton
