import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Fulano sicrano',
  })
  @IsString({ message: 'O nome precisa ser uma string' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'fulano@email.com',
  })
  @IsEmail({}, { message: 'O email deve ser válido' })
  @IsNotEmpty({ message: 'O email não pode estar vazio' })
  @Expose()
  email!: string;

  @ApiProperty({
    description: 'senha do usuário',
    example: '123456',
  })
  @IsString({ message: 'A senha deve ser válido' })
  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  password!: string;
}
