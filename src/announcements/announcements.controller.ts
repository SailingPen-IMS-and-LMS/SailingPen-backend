import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Patch,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
// import { CreateAnnouncementDto } from './dto/create-announcements.dto';
// import { UpdateAnnouncementDto } from './dto/update-announcements.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/types/jwt.types';
import type { Request } from 'express';
import { 
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from './dto/create-announcements.dto';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // create announcements
  @Post('create')
  @Roles('tutor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  createAnnouncement(
    @Req() req: Request,
    @Body() createAnnouncementDto: CreateAnnouncementDto,
  ) {
    const user = req.user as AuthenticatedUser;
    const userId = user.sub;
    return this.announcementsService.createAnnouncement(
      userId,
      createAnnouncementDto,
    );
  }

  //update
  @Patch('update/:id')
  @Roles('tutor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateAnnouncement(
    @Param('id') id: number,
    @Req() req: Request,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    const user = req.user as AuthenticatedUser;
    const userId = user.sub;
    return this.announcementsService.updateAnnouncement(
      userId,
      +id, 
      updateAnnouncementDto,
    );
  }

  //   @Get()
  //   findAll() {
  //     return this.announcementsService.findAll();
  //   }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.announcementsService.findOne(+id);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.announcementsService.remove(+id);
  //   }
}
