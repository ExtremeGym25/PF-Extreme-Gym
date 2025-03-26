"use client";
import { routes } from "@/app/routes/routes";
import { usePathname } from "next/navigation";
import React, { FC } from "react";
//Solo sea visible donde queremos
interface VisibleWrapperProps {
  children: React.ReactNode;
}
const hidePages = [
  routes.login,
  routes.registro,
  routes.admin,
  routes.adminImagenes,
];

const VisibleWrapper: FC<VisibleWrapperProps> = ({ children }) => {
  //hook next el children es la nvbar
  const pathname = usePathname();
  if (hidePages.includes(pathname)) {
    return null;
  }
  return <>{children}</>;
};

export default VisibleWrapper;
