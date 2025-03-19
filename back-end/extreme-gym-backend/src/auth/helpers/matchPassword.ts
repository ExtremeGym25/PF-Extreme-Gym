import {
    ValidatorConstraintInterface, 
    ValidatorConstraint,
    ValidationArguments
} from 'class-validator'

@ValidatorConstraint({name: 'MatchPassword', async : false})
export class MatchPassword implements ValidatorConstraintInterface {
    validate( password : string, args: ValidationArguments) {
        if(password !== (args.object as any)[args.constraints[0]]) return false;
        return true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Password do not match'
    }
}