import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthorService } from 'src/author/services';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Author } from 'src/author/entities/author.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly authorService: AuthorService,
    private readonly jwtService: JwtService,
  ) {}
  async validateAuthor(username: string, password: string): Promise<any> {
    const author = await this.authorService.findOneByUsername(username);
    const validPassword = await bcrypt.compare(password, author.password);
    if (author && validPassword) {
      const { password, ...result } = author;
      return result;
    }
    return null;
  }

  async login(credentials: Pick<Author, 'username' | 'password'>) {
    const validAuthor = await this.validateAuthor(
      credentials.username,
      credentials.password,
    );
    const payload = { username: validAuthor.username, id: validAuthor.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}