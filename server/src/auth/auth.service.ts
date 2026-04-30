import { UnauthorizedException } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import { Repository } from "typeorm";
import { LoginDto } from "./dto/login.dto";
import { AdminEntity } from "./entities/admin.entity";

type LoginResponse = {
  accessToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminsRepository: Repository<AdminEntity>,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: LoginDto): Promise<LoginResponse> {
    const admin = await this.adminsRepository.findOne({
      where: {
        login: dto.login
      }
    });

    if (!admin) {
      throw new UnauthorizedException("Неверный логин или пароль");
    }

    const isPasswordCorrect = await bcrypt.compare(dto.password, admin.passwordHash);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException("Неверный логин или пароль");
    }

    const accessToken = await this.jwtService.signAsync({
      sub: admin.id,
      login: admin.login
    });

    return {
      accessToken
    };
  }
}
