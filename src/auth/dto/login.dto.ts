import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'fulano@email.com',
  })
  @IsEmail({}, { message: 'O email deve ser válido' })
  @IsNotEmpty({ message: 'O email não pode estar vazio' })
  email!: string;

  @ApiProperty({
    description: 'senha do usuário',
    example: '123456',
  })
  @IsString({ message: 'A senha deve ser válida' })
  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  password!: string;
}
