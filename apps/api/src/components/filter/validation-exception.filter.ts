import { ValidationError } from '@nestjs/common';

/**
 * 밸리데이션 에러에 대한 exception filter
 * @param errors - 에러목록
 */
export const validationExceptionFilter = (errors: ValidationError[]): Error => {
  for (const error of errors) {
    if (error.constraints) {
      const [errorMessage] = Object.values(error.constraints);
      return new Error(errorMessage);
    }
    if (error.children) return validationExceptionFilter(error.children);
  }
  return new Error('유효성 검사에 실패했습니다.');
};
