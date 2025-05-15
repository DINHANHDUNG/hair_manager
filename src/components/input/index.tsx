import * as React from 'react'
import { IMaskInput } from 'react-imask'
import { NumericFormat, NumericFormatProps } from 'react-number-format'

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}

export const TextMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props
  return (
    <IMaskInput
      {...other}
      mask='(#00) 000-0000'
      definitions={{
        '#': /[1-2]/
      }}
      inputRef={ref}
      onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  )
})

export const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value
            }
          })
        }}
        thousandSeparator
        valueIsNumericString
        // prefix='$'
      />
    )
  }
)

export const InputPropsNumber = (perm: boolean) => {
  return {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    inputComponent: perm && (NumericFormatCustom as any)
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
}
