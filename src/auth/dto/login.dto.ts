import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'O formato do e-mail é inválido' })
  email!: string;

  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  senha!: string;
}