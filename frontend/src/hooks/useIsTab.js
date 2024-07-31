import { useMediaQuery } from "react-responsive";

export const useIsTab = () => {
  const isTablet = useMediaQuery({
    minWidth: 768,
    maxWidth: 1223,
  });

  return isTablet;
};
