//app.components.common.buttons.tsx
import { ButtonProps } from '~/types'
import { Button } from '../ui/button'

export const ConfirmationButtons = (buttonProps: ButtonProps) => {
  return (
    <Button
      onClick={buttonProps.onClick}
      className='w-full bg-blue-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700'
    >
      {buttonProps.text ? buttonProps.text : buttonProps.children}
    </Button>
  )
}

export const DestructiveButtons = (buttonProps: ButtonProps) => {
  return (
    <Button
      variant={'destructive'}
      onClick={buttonProps.onClick}
      className='w-full bg-red-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-red-700'
    >
      {buttonProps.text ? buttonProps.text : buttonProps.children}
    </Button>
  )
}

export const OutlinedButtons = (buttonProps: ButtonProps) => {
  return (
    <Button
      onClick={buttonProps.onClick}
      className='w-full bg-white/20 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-white/30'
    >
      {buttonProps.text ? buttonProps.text : buttonProps.children}
    </Button>
  )
}
