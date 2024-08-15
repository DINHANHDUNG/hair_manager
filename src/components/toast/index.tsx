import { enqueueSnackbar } from 'notistack'
interface Props {
  text: string
  variant: 'default' | 'error' | 'success' | 'warning' | 'info'
  anchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'center' | 'right' }
}
export default function Toast(Props: Props) {
  const { text, variant, anchorOrigin } = Props
  return enqueueSnackbar(text, {
    variant: variant,
    anchorOrigin: anchorOrigin || { vertical: 'top', horizontal: 'right' }
  })
}
