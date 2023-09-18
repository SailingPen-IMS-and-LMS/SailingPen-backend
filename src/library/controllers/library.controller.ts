import {
  Controller,
  Get,
  Body,
  Post,
  UseGuards,
  Req,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { LibraryService } from '../services/library.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthenticatedUser } from 'src/auth/types/jwt.types';
import { CreateLibraryFolderDto } from '../dto/create-library-folder.dto';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Roles('tutor')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('folders')
  getFolderStructure(@Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    return this.libraryService.getFoldersForTutor(user.sub);
  }

  @Roles('tutor')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('folders/root')
  getFoldersInRoot(@Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    return this.libraryService.getRootFolderChildren(user.sub);
  }

  @Roles('tutor')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('folders/:id')
  getFoldersOfFolder(@Req() req: Request, @Param('id') id: number) {
    const user = req.user as AuthenticatedUser;
    return this.libraryService.getFolderChildrenOfFolder(user.sub, id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Roles('tutor')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('folders')
  createFolder(
    @Req() req: Request,
    @Body() createLibraryFolderDto: CreateLibraryFolderDto,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.libraryService.createFolder(user.sub, createLibraryFolderDto);
  }
}
