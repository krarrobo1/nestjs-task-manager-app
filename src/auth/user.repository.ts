import { Repository, EntityRepository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User>{
    async signUp(authCredentialsDto: AuthCredentialsDto) : Promise<void>{
        const { username, password } = authCredentialsDto;
        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        console.log({pass: user.password});
        
       
        try {
            await user.save();
        } catch (error) {
            // duplicate_key
            if(error.code === '23505') throw new ConflictException('username already exists');
            else throw new InternalServerErrorException('Something went wrong');
        }
    }
    async validateUserPassword(authCredentialsDto: AuthCredentialsDto) : Promise<string>{
        const { username, password } = authCredentialsDto;
        const user = await this.findOne({ username });
        if(user && await user.validatePassword(password)) return user.username;
        else return null;
    }
    private async hashPassword(password: string, salt: string) : Promise<string>{
        return await bcrypt.hash(password, salt);
    }
}