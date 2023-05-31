import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

const hashingPass = async (dto: CreateUserDto) => {
  if (dto.password) {
    const hashPassword: string = await bcrypt.hash(dto.password, 10);
    dto.password = hashPassword;
  }
};

const compareHashingPass = async (
  password: string,
  passwordFromUser: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, passwordFromUser);
};

const checkFloat = (num: number) => Math.round(num * 100) / 100;

export { checkFloat, hashingPass, compareHashingPass };
