import { useRef } from "react";

export const ButtonWithTooltip = ({ onClick, onState, OnIcon, OffIcon }) => {
  const btnRef = useRef();
  return (
    <>
      <div>
        <button
          ref={btnRef}
          onClick={onClick}
          className={`py-3 px-5 flex items-center justify-center shadow-md bg-indigo-700 rounded-full`}
        >
          {onState ? OnIcon : OffIcon}
        </button>
      </div>
    </>
  );
};
