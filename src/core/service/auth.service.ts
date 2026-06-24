import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { genSalt, hash } from 'bcryptjs';
import * as randomToken from 'rand-token';
import dayjs from 'dayjs';
import {
  FuncionRepository,
  MenuRepository,
  RolRepository,
  UserRepository,
} from '../../persistence/repository';
import {
  AuthCredentialsDto,
  ReadFuncionDto,
  ReadMenuDto,
  ReadUserDto,
  RequestResetPasswordDto,
  ResetPasswordDto,
  ResponseDto,
  SecretDataDto,
  SelfChangePasswordDto,
  UserDto,
} from '../../shared/dto';
import { FuncionEntity, RolEntity, UserEntity } from '../../persistence/entity';
import { eliminarDuplicado } from '../../../lib';
import { IJwtPayload } from '../../shared/interface';
import { FuncionMapper, MenuMapper, UserMapper } from '../mapper';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private rolRepository: RolRepository,
    private funcionRepository: FuncionRepository,
    private funcionMapper: FuncionMapper,
    private menuRepository: MenuRepository,
    private menuMapper: MenuMapper,
    private userMapper: UserMapper,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}
  async signUp(userDto: UserDto,): Promise<ResponseDto> {
    const result = new ResponseDto();
    const { userName, password, email } = userDto;
    const userEntity: UserEntity = new UserEntity(userName, email ?? '');
    userEntity.salt = await genSalt();
    userEntity.password = await AuthService.hashPassword(
      password,
      userEntity.salt,
    );
    try {
      await this.userRepository.signUp(userEntity);
      result.successStatus = true;
      result.message = 'success';
    } catch (error: unknown) {
      // TypeScript 6: manejar error de tipo unknown
      if (error instanceof Error) {
        result.message = (error as any).response ?? error.message;
      } else {
        result.message = String(error);
      }
      result.successStatus = false;
      return result;
    }
    return result;
  }
  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<SecretDataDto> {
    const { userName, password } = authCredentialsDto;
    const credential = await this.userRepository.validateUserPassword(
      userName,
      password,
    );
    if (!credential) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }
    const user: UserEntity | null = await this.userRepository.findByName(userName);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }
    const funcionsIndiv: FuncionEntity[] = user.funcions ?? [];
    let funcions: FuncionEntity[] = [];
    let item: RolEntity;
    if (user.roles) {
      for (const rol of user.roles) {
        item = await this.rolRepository.findById(rol.id);
        if (item.funcions) {
          item.funcions.forEach((funcion: FuncionEntity) =>
            funcion.activo ? funcions.push(funcion) : null,
          );
        }
      }
    }
    funcions = funcions.concat(funcionsIndiv);
    funcions = eliminarDuplicado(funcions);
    funcions = await this.funcionRepository.findByIds(
      funcions.map((item) => item.id),
    );
    const readFuncionDtos: ReadFuncionDto[] = [];
    for (const funcion of funcions) {
      readFuncionDtos.push(await this.funcionMapper.entityToDto(funcion));
    }
    const readMenuDtos: ReadMenuDto[] = [];
    for (const readFuncionDto of readFuncionDtos) {
      if (readFuncionDto.menu !== undefined) {
        readMenuDtos.push(readFuncionDto.menu);
      }
    }
    const payload: IJwtPayload = { userName };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.getRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      functions: readFuncionDtos,
      menus: readMenuDtos,
    };
  }
  private static async hashPassword(
    password: string,
    salt: string,
  ): Promise<string> {
    return hash(password, salt);
  }
  public async getRefreshToken(id: number): Promise<string> {
    const userEntity: UserEntity | null = await this.userRepository.findById(id);
    if (!userEntity) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    userEntity.refreshToken = randomToken.generate(16);
    userEntity.refreshTokenExp = dayjs().add(1, 'day').format('YYYY/MM/DD');
    await this.userRepository.update(userEntity);
    return userEntity.refreshToken;
  }
  async regenerateTokens(user: UserEntity, ip: string): Promise<SecretDataDto> {
    const userName = user.userName;
    const userEntity: UserEntity | null = await this.userRepository.findById(user.id);
    if (!userEntity) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    const funcionsIndiv: FuncionEntity[] = userEntity.funcions ?? [];
    let funcions: FuncionEntity[] = [];
    let item: RolEntity;
    if (userEntity.roles) {
      for (const rol of userEntity.roles) {
        item = await this.rolRepository.findById(rol.id);
        if (item.funcions) {
          item.funcions.forEach((funcion: FuncionEntity) =>
            funcion.activo ? funcions.push(funcion) : null,
          );
        }
      }
    }
    funcions = funcions.concat(funcionsIndiv);
    funcions = eliminarDuplicado(funcions);

    const readFuncionDtos: ReadFuncionDto[] = [];
    for (const funcion of funcions) {
      readFuncionDtos.push(await this.funcionMapper.entityToDto(funcion));
    }
    // const roles = user.roles.map((rol: RolEntity) => rol.nombre as RolType);
    const readMenuDtos: ReadMenuDto[] = [];
    for (const readFuncionDto of readFuncionDtos) {
      if (readFuncionDto.menu !== undefined) {
        readMenuDtos.push(readFuncionDto.menu);
      }
    }
    const payload: IJwtPayload = { userName };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.getRefreshToken(user.id);
    return {
      accessToken,
      refreshToken,
      functions: readFuncionDtos,
      menus: readMenuDtos,
    };
  }
  async logout(user: UserEntity): Promise<ResponseDto> {
    // En TypeScript 6, usamos undefined en lugar de null para tipos opcionales
    user.refreshToken = undefined;
    user.refreshTokenExp = undefined;
    await this.userRepository.update(user);
    const result = new ResponseDto();
    result.successStatus = true;
    result.message = 'success';
    return result;
  }

  /**
   * Solicitar recuperación de contraseña.
   * Genera un código numérico de 6 dígitos, lo guarda en el usuario
   * con fecha de expiración (24 horas) y envía un email con el código.
   */
  async requestPasswordReset(
    requestResetPasswordDto: RequestResetPasswordDto,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    const { email } = requestResetPasswordDto;

    const user: UserEntity | null =
      await this.userRepository.findByEmail(email);
    if (!user) {
      // Por seguridad, no revelar si el email existe o no
      result.successStatus = true;
      result.message =
        'Si el email está registrado, recibirá un código de recuperación.';
      return result;
    }

    if (!user.email) {
      result.successStatus = false;
      result.message = 'El usuario no tiene un email asociado.';
      return result;
    }

    // Generar código numérico de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000);
    user.resetPasswordCode = code;
    user.resetPasswordCodeExp = dayjs().add(24, 'hour').format('YYYY/MM/DD');

    try {
      await this.userRepository.update(user);
      await this.mailService.sendPasswordResetEmail(user, code);
      result.successStatus = true;
      result.message =
        'Si el email está registrado, recibirá un código de recuperación.';
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.message = error.message;
      } else {
        result.message = String(error);
      }
      result.successStatus = false;
    }

    return result;
  }

  /**
   * Restablecer la contraseña usando el código de recuperación.
   * Valida que el código exista y no haya expirado, hashea la nueva
   * contraseña y limpia el código de recuperación.
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<ResponseDto> {
    const result = new ResponseDto();
    const { resetPasswordCode, password } = resetPasswordDto;

    const user: UserEntity | null =
      await this.userRepository.findByResetCode(resetPasswordCode);
    if (!user) {
      throw new BadRequestException(
        'Código de recuperación inválido o expirado.',
      );
    }

    // Generar nuevo salt y hashear la nueva contraseña
    user.salt = await genSalt();
    user.password = await AuthService.hashPassword(password, user.salt);

    // Limpiar el código de recuperación
    user.resetPasswordCode = undefined;
    user.resetPasswordCodeExp = undefined;

    // Invalidar refresh tokens existentes por seguridad
    user.refreshToken = undefined;
    user.refreshTokenExp = undefined;

    try {
      await this.userRepository.update(user);
      result.successStatus = true;
      result.message = 'Contraseña actualizada correctamente.';
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.message = error.message;
      } else {
        result.message = String(error);
      }
      result.successStatus = false;
    }

    return result;
  }

  /**
   * Obtener el perfil del usuario autenticado.
   */
  async getProfile(user: UserEntity): Promise<ReadUserDto> {
    const userEntity: UserEntity | null = await this.userRepository.findById(
      user.id,
    );
    if (!userEntity) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    return await this.userMapper.entityToDto(userEntity);
  }

  /**
   * Cambiar la contraseña del usuario autenticado.
   * Verifica la contraseña actual antes de permitir el cambio.
   */
  async changeOwnPassword(
    user: UserEntity,
    selfChangePasswordDto: SelfChangePasswordDto,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();

    const userEntity: UserEntity | null = await this.userRepository.findById(
      user.id,
    );
    if (!userEntity) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    // Verificar la contraseña actual
    const isValidPassword = await userEntity.validatePassword(
      selfChangePasswordDto.currentPassword,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('La contraseña actual es incorrecta.');
    }

    // Generar nuevo salt y hashear la nueva contraseña
    userEntity.salt = await genSalt();
    userEntity.password = await AuthService.hashPassword(
      selfChangePasswordDto.password,
      userEntity.salt,
    );

    // Invalidar refresh tokens existentes por seguridad
    userEntity.refreshToken = undefined;
    userEntity.refreshTokenExp = undefined;

    try {
      await this.userRepository.update(userEntity);
      result.successStatus = true;
      result.message = 'Contraseña actualizada correctamente.';
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.message = error.message;
      } else {
        result.message = String(error);
      }
      result.successStatus = false;
    }

    return result;
  }
}
