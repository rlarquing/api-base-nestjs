import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ description: 'refreshToken.', example: 'uDUbczmRD6OxLNAS' })
  refreshToken: string;
}
