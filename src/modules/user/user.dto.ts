import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  firstName: string;
  @IsOptional()
  lastName: string;
  @IsOptional()
  bio: string;
  @IsOptional()
  email: string;
  @IsOptional()
  coverImage: string;
  @IsOptional()
  profileImage: string;
  @IsOptional()
  phoneNumber: number;
  @IsOptional()
  facebook: string;
  @IsOptional()
  instagram: string;
  @IsOptional()
  reddit: string;
  @IsOptional()
  twitter: string;
  @IsOptional()
  discord: string;
  @IsOptional()
  youtube: string;
  @IsOptional()
  telegram: string;
}

export class validateEmailDto {
  @IsString()
  identifier: string;
}

export class UpdateRegisterDto {
  @IsNotEmpty()
  bio: string;
  @IsNotEmpty()
  website: string;
  @IsOptional()
  portfolio: any;
  // @IsOptional()
  // facebook: string;
  // @IsOptional()
  // instagram: string;
  // @IsOptional()
  // reddit: string;
  // @IsOptional()
  // twitter: string;
  // @IsOptional()
  // discord: string;
  // @IsOptional()
  // youtube: string;
  // @IsOptional()
  // telegram: string;
}
export class UpdateInformationDto {
  @IsOptional()
  bio: string;
  @IsOptional()
  website: string;
  @IsOptional()
  portfolio: any;
  @IsOptional()
  facebook: string;
  @IsOptional()
  instagram: string;
  @IsOptional()
  reddit: string;
  @IsOptional()
  twitter: string;
  @IsOptional()
  discord: string;
  @IsOptional()
  youtube: string;
  @IsOptional()
  telegram: string;
}
export class CreateWalletDto {
  // @IsString()
  // @IsNotEmpty()
  // userId: string;
  @IsString()
  @IsNotEmpty()
  address: string;
  isPrimary: boolean;
}
