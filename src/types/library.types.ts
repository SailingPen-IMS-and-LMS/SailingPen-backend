export interface LibraryFolderRecursively {
  id: number;
  name: string;
  children: LibraryFolderRecursively[];
  prentId?: number;
}

export interface LibraryFolder {
  id: number;
  name: string;
}
