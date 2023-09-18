import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  LibraryFolder,
  LibraryFolderRecursively,
} from 'src/types/library/library.types';
import { CreateLibraryFolderDto } from '../dto/create-library-folder.dto';

@Injectable()
export class LibraryService {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createFolder(
    userId: string,
    { name, parent_folder_id }: CreateLibraryFolderDto,
  ) {
    const parentFolder = await this.prisma.libraryFolder.findFirst({
      where: {
        tutor: {
          user_id: userId,
        },
        id: parent_folder_id,
      },
      include: {
        tutor: true,
      },
    });
    console.log(parentFolder);
    if (!parentFolder) {
      throw new ForbiddenException(`You don't have access to this folder`);
    }

    await this.prisma.libraryFolder.update({
      where: {
        id: parent_folder_id,
      },
      data: {
        children: {
          create: {
            name,
            tutor_id: parentFolder.tutor_id,
          },
        },
      },
    });
    return this.getFolderChildren(parent_folder_id);
  }

  async getRootFolderChildren(userId: string) {
    const library = await this.prisma.library.findFirst({
      where: {
        tutor: {
          user_id: userId,
        },
      },
      include: {
        rootFolder: true,
      },
    });
    if (!library) {
      throw new InternalServerErrorException('Library wasnt found');
    }

    const rootFolder = library.root_folder_id;
    if (!rootFolder) {
      throw new InternalServerErrorException('Root folder wasnt found');
    }
    const folders = await this.getFolderChildren(rootFolder);
    return { root_folder_id: rootFolder, folders };
  }

  async getFolderChildrenOfFolder(userId: string, parentFolderId: number) {
    const parentFolder = await this.prisma.libraryFolder.findFirst({
      where: {
        tutor: {
          user_id: userId,
        },
        id: Number(parentFolderId),
      },
    });
    if (!parentFolder) {
      throw new ForbiddenException(
        `You aren't authorized to access this folder`,
      );
    }

    const folders = await this.getFolderChildrenRecursively(parentFolder.id);
    return folders;
  }

  async getFoldersForTutor(userId: string) {
    const library = await this.prisma.library.findFirst({
      where: {
        tutor: {
          user_id: userId,
        },
      },
      include: {
        rootFolder: true,
      },
    });
    if (!library) {
      throw new InternalServerErrorException('Library wasnt found');
    }

    const rootFolder = library.root_folder_id;
    if (!rootFolder) {
      throw new InternalServerErrorException('Root folder wasnt found');
    }
    const folders = await this.getFolderChildrenRecursively(rootFolder);
    return folders;
  }

  async getFolderChildrenRecursively(parentId: number) {
    const folders = await this.prisma.libraryFolder.findMany({
      where: {
        parentId: parentId,
      },
      include: {
        children: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const folderStructure: LibraryFolderRecursively[] = [];

    for (const folder of folders) {
      folderStructure.push({
        id: folder.id,
        name: folder.name,
        children: await this.getFolderChildrenRecursively(folder.id),
      });
    }

    return folderStructure;
  }

  async getFolderChildren(parentId: number) {
    const folders = await this.prisma.libraryFolder.findMany({
      where: {
        parentId: parentId,
      },
      include: {
        children: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const folderStructure: LibraryFolder[] = [];

    for (const folder of folders) {
      folderStructure.push({
        id: folder.id,
        name: folder.name,
      });
    }

    return folderStructure;
  }
}
