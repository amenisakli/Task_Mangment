import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService:JwtService
    ) { }
    async SignUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
        authCredentialsDto.password = await this.hashpassword(password, 10)
        const exist = await this.userRepository.findOne({ where: { username } });
        if (exist) {
            throw new HttpException(
                'Username already exists',
                HttpStatus.BAD_REQUEST,
            );
        }
        const user1 = this.userRepository.create({ ...authCredentialsDto });
        try {
            await this.userRepository.save(user1);
        } catch (error) {
            throw new HttpException(
                'Failed to create user',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    async SignIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        try {
          const user = await this.userRepository.findOne({ where: { username } });    
          if (!user) {
            throw new NotFoundException('User not found');
          }
          const isPasswordValid = await bcrypt.compare(password, user.password);    
          if (!isPasswordValid) {
            console.log('Invalid password');
            throw new Error('Invalid password');
          }    
          console.log('Authentication successful');   
          const payload: JwtPayload = { username };
          const accessToken = await this.jwtService.sign(payload);    
          return accessToken;
        } catch (error) {
          console.error('Error occurred during authentication:', error);
          throw new Error('Authentication failed');
        }
      }    
    private async hashpassword(password: string, salt: number): Promise<string> {
        return bcrypt.hash(password, salt)
    }
}
