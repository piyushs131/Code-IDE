import IDirectory from "../@types/directory.d";

const useDirectory = () => {

  const isFileOrFolderAlreadyExists = (
    directories: Array<IDirectory>,
    path: Array<string>,
    name: string,
    isRenameCheck: boolean = false,
    indx: number = 1
  ) => {
    
    const baseCheck = isRenameCheck ? indx + 1 : indx;

    if (path.length === baseCheck) {
      const targetIndx = directories.findIndex(
        (directory) =>
          directory.name.trim().toLowerCase() === name.trim().toLowerCase()
      );
      return targetIndx !== -1;
    }

    const childIndx = directories.findIndex(
      (directory) => directory.id === path[indx]
    );

    if (childIndx === -1) return false;

    if (
      directories[childIndx].isFolder &&
      isFileOrFolderAlreadyExists(
        directories[childIndx].children,
        path,
        name,
        isRenameCheck,
        indx + 1
      )
    )
      return true;

    // if the child directory is not a folder then return false
    return false;
  };


  const findDirectory = (directory: IDirectory, directoryPath: Array<string>): IDirectory | null => {
  let currentDirectory = directory;

  for (let i = 0; i < directoryPath.length; i++) {
    let childFound = false;

    for (let j = 0; j < currentDirectory.children.length; j++) {
      if (currentDirectory.children[j].id === directoryPath[i]) {
        currentDirectory = currentDirectory.children[j];
        childFound = true;
        break;
      }
    }

    if (!childFound) {
      return null;
    }
  }

  return currentDirectory;
};

const findDirectoryPath = (directory: IDirectory, directoryPath: Array<string>): string => {
  let currentDirectory = directory;
  let fullPath = directory.name;

  for (let i = 0; i < directoryPath.length; i++) {
    let childFound = false;

    for (let j = 0; j < currentDirectory.children.length; j++) {
      if (currentDirectory.children[j].id === directoryPath[i]) {
        currentDirectory = currentDirectory.children[j];
        fullPath += "/" + currentDirectory.name;
        childFound = true;
        break;
      }
    }

    if (!childFound) {
      return "path not found";
    }
  }

  return fullPath;
};

return {
  isFileOrFolderAlreadyExists,
  findDirectory,
  findDirectoryPath,
};
};

export default useDirectory;
