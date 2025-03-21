import { createContext } from 'react';

export interface PathContext {
  current: string[];
};

export const Path = createContext<{
  path: PathContext;
  setPath: React.Dispatch<React.SetStateAction<PathContext>>;
}>(
  {} as {
    path: PathContext;
    setPath: React.Dispatch<React.SetStateAction<PathContext>>;
  },
);

export interface SelectedFile {
  name: string;
}

export interface SelectedFilesContext {
  selectedFiles: SelectedFile[];
};

export const SelectedFiles = createContext<{
  selectedFiles: SelectedFile[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<SelectedFile[]>>;
}>(
  {} as {
    selectedFiles: SelectedFile[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<SelectedFile[]>>;
  },
);
