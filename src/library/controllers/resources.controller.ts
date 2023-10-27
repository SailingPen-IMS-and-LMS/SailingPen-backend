import {
  Controller,
  Body,
  Post,
  Get,
  UseGuards,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { FormDataRequest } from 'nestjs-form-data';
import { ResourcesService } from '../services/resources.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthenticatedUser } from 'src/auth/types/jwt.types';
import { CreateImageOrDocumentResourceDto } from '../dto/create-image-or-document-resource.dto';
import { CreateVideoResourceDto } from "../dto/create-video.dto"

@Controller('library/resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) { }



  @HttpCode(HttpStatus.CREATED)
  @Roles('tutor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('video')
  @FormDataRequest()
  createVideo(
    @Req() req: Request,
    @Body() createVideoResource: CreateVideoResourceDto,
    @Query('folderId') folderId: number,) {
    const user = req.user as AuthenticatedUser;
    return this.resourcesService.createVideoResource(
      user.sub,
      Number(folderId),
      createVideoResource,
    );
  }



  @HttpCode(HttpStatus.CREATED)
  @Roles('tutor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('image-or-document')
  @FormDataRequest()
  createImageOrDocumentResource(
    @Req() req: Request,
    @Body() createImageOrDocumentResource: CreateImageOrDocumentResourceDto,
    @Query('folderId') folderId: number,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.resourcesService.createResource(
      user.sub,
      Number(folderId),
      createImageOrDocumentResource,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Roles('tutor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('image-or-document')
  getImageOrDocumentResources(
    @Req() req: Request,
    @Query('folderId') folderId: number,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.resourcesService.getResources(user.sub, folderId);
  }
}
