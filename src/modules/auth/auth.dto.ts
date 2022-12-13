import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
  phoneNumber: string;
  profileImage: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class verifyCodeDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  pin: number;
}
export class forgetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class validateEmailUsernameDto {
  @IsString()
  identifier: string;
}

export class landingSignupDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class contactUsDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
  description: string;
}
export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  @Matches(
    /(?=^.{8,}$)(?=.*\d)(?=.*[!$%^&()_+|~=`{}\[\]:";'<>?,.#@*-\/\\]*)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    {
      message: 'Password too weak',
    },
  )
  password: string;
  @IsNotEmpty()
  @IsString()
  @Length(8)
  code: number;
}

// --------------------------------------------------ADMIN DASHBOARD--------------------------------------------------

export class adminSignupDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
  role: string;
  phoneNumber: string;
  profileImage: string;
}
