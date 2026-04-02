import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator'
import { SendOtpRequest } from 'src/modules/auth/dto'

@ValidatorConstraint({ name: 'IdentifierValidator', async: false })
export class IdentifierValidator implements ValidatorConstraintInterface {
	validate(value: string, args: ValidationArguments) {
		const object = args.object as SendOtpRequest

		if (object.type === 'email') {
			return (
				typeof value === 'string' &&
				/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
			)
		} else if (object.type === 'phone') {
			return typeof value === 'string' && /^\+?[1-9]\d{9,14}$/.test(value)
		}

		return false
	}

	defaultMessage(args: ValidationArguments) {
		const object = args.object as SendOtpRequest

		if (object.type === 'email') {
			return 'Identifier must be a valid email address.'
		} else if (object.type === 'phone') {
			return 'Identifier must be a valid phone number.'
		}

		return 'Invalid identifier type.'
	}
}
