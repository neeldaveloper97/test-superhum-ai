import { useMediaQuery } from "react-responsive";

export const useIsMobile = (maxWidth) => {
  const isMobile = useMediaQuery({ maxWidth: maxWidth || 767 });
  return isMobile;
};
