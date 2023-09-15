import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { GetUser } from './get-user.decorators';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signup')
    SignUp(@Body(ValidationPipe) authDto: AuthCredentialsDto):Promise<void>{
       return this.authService.SignUp(authDto)
    }
    @Post('/signin')
    SignIn(@Body(ValidationPipe) authDto: AuthCredentialsDto):Promise<string> {
       return this.authService.SignIn(authDto)
    }
    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User) {
        console.log(user);
        // Your logic here
    }
    

}
