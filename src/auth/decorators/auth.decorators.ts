import { applyDecorators } from '@nestjs/common';
import { Role } from '../enums/rol.enums';

export function Auth(role: Role) {
  return applyDecorators();
}
