import {
  Controller,
  Body,
  Post,
  UseGuards,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { ResourcesService } from '../services/resources.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthenticatedUser } from 'src/auth/types/jwt.types';
import { CreateImageOrDocumentResourceDto } from '../dto/create-image-or-document-resource.dto';

@Controller('library/resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Roles('tutor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('')
  createImageOrDocumentResource(
    @Req() req: Request,
    @Body() createImageOrDocumentResource: CreateImageOrDocumentResourceDto,
    @Query('folderId') folderId: number,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.resourcesService.createResource(
      user.sub,
      folderId,
      createImageOrDocumentResource,
    );
  }
}
