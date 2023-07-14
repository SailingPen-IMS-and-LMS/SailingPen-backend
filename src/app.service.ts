import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getHello() {
    await this.prisma.user.create({
      data: {
        f_name: 'nethsara',
        l_name: 'elvitigala',
        address: ' e222',
        contact_no: '34343g423wefw',
        nic: '200022203401532g42wew',
        dob: new Date('2000 august 9'),
        email: 'zrereergerwfwewef',
        password: 'fewfefer',
        username: 'ewfeferfwefwewefw',
        posts: {
          createMany: {
            data: [
              { title: 'Post 2', content: 'Post 2 content' },
              { title: 'Post 3', content: 'Post 3 content' },
            ],
          },
        },
      },
    });
    return 'Hello  World';
  }

  async getPostTitles() {
    const data = await this.prisma.post.findMany({
      select: {
        title: true,
      },
    });

    return data.map(({ title }) => title);
  }
}
