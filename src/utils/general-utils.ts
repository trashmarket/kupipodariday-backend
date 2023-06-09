import * as bcrypt from 'bcrypt';
import { isArray } from 'class-validator';
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

const extractInterceptorCallback = (data: any, property: string | null) => {
  if (isArray(data)) {
    return data.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...intercepterdData } = property
        ? item[property]
        : item;
      return property
        ? { ...item, [property]: intercepterdData }
        : { ...item, ...intercepterdData };
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...intercepterdData } = property ? data[property] : data;
  return property
    ? { ...data, [property]: intercepterdData }
    : { ...intercepterdData };
};

export {
  checkFloat,
  hashingPass,
  compareHashingPass,
  extractInterceptorCallback,
};
