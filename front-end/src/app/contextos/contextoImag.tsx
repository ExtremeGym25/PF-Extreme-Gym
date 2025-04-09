"use client";
import { createContext, useContext, useState, useEffect } from "react";
interface ImageContextProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>; // <--- esta es la clave
}

const ImageContext = createContext<ImageContextProps | undefined>(undefined);

export const ImageProvider = ({ children }: { children: React.ReactNode }) => {
  const [images, setImages] = useState<string[]>([]);

  return (
    <ImageContext.Provider value={{ images, setImages }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context)
    throw new Error("useImageContext debe estar dentro de ImageProvider");
  return context;
};
