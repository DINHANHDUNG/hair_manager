/**
 * Password validator for login pages
 */
import value from 'assets/scss/_themes-vars.module.scss'
import { VALIDATE } from '../common/validate'

// has number
const hasNumber = (number: string) => new RegExp(VALIDATE.number).test(number)

// has mix of small and capitals
const hasMixed = (number: string) =>
  new RegExp(VALIDATE.textNoUppercase).test(number) && new RegExp(VALIDATE.textUppercase).test(number)

// has special chars
const hasSpecial = (number: string) => new RegExp(/[!#@$%^&*)(+=._-]/).test(number)

// set color based on password strength
export const strengthColor = (count: number) => {
  if (count < 2) return { label: 'Poor', color: value.errorMain }
  if (count < 3) return { label: 'Weak', color: value.warningDark }
  if (count < 4) return { label: 'Normal', color: value.orangeMain }
  if (count < 5) return { label: 'Good', color: value.successMain }
  if (count < 6) return { label: 'Strong', color: value.successDark }
  return { label: 'Poor', color: value.errorMain }
}

// password strength indicator
export const strengthIndicator = (number: string) => {
  let strengths = 0
  if (number.length > 5) strengths += 1
  if (number.length > 7) strengths += 1
  if (hasNumber(number)) strengths += 1
  if (hasSpecial(number)) strengths += 1
  if (hasMixed(number)) strengths += 1
  return strengths
}
