import { Popover, Transition } from "@headlessui/react";
import { IoChevronDown, IoCheckmarkDoneSharp } from "react-icons/io5";
import { Fragment, useState } from "react";
import { useVideoCfcContext } from "../../context/VideoCfcContext";
import { HiVideoCamera } from "react-icons/hi2";

export default function DropDownCam({ webcams, changeWebcam }) {
  const { setSelectedWebcam, selectedWebcam, isCameraPermissionAllowed } =
    useVideoCfcContext();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Popover className="relative ml-3">
        {({ open }) => (
          <>
            <Popover.Button
              onMouseEnter={() => {
                setIsHovered(true);
              }}
              onMouseLeave={() => {
                setIsHovered(false);
              }}
              disabled={!isCameraPermissionAllowed}
              className={`focus:outline-none hover:ring-1 hover:ring-gray-250
              ${
                open
                  ? "text-white ring-1 ring-gray-250 bg-black"
                  : "text-customGray-250 hover:text-white"
              }
              group flex items-center rounded-md px-3 py-1 w-44 text-base font-normal bg-indigo-700 rounded shadow-md
              ${!isCameraPermissionAllowed ? "opacity-50" : ""}`}
            >
              <HiVideoCamera />
              <span className=" overflow-hidden whitespace-nowrap overflow-ellipsis w-28 ml-7">
                {isCameraPermissionAllowed
                  ? selectedWebcam?.label
                  : "Permission Needed"}
              </span>

              <IoChevronDown
                className={`${open ? "text-orange-300" : "text-orange-300/70"}
                ml-8 h-5 w-5 transition duration-150 ease-in-out group-hover:text-orange-300/80 mt-1`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute bottom-full z-10 w-72 sm:px-0 pb-2">
                <div className="shadow-lg">
                  <div className="bg-gray-350">
                    <div className="bg-gray-800 rounded-xl py-2">
                      <div className="flex flex-col">
                        {webcams.map((item, index) => {
                          return (
                            item?.kind === "videoinput" && (
                              <div
                                key={`webcams_${index}`}
                                className={`relative my-1 pl-4 pr-2 text-white text-left flex items-center w-full`}
                              >
                                <span className="absolute top-3 right-2 w-6 mr-2 flex items-center justify-center text-sm">
                                  {selectedWebcam?.label === item?.label && (
                                    <IoCheckmarkDoneSharp color="lime" />
                                  )}
                                </span>
                                <button
                                  className={`flex flex-1 w-full text-left text-sm rounded-full bg-indigo-700 px-3`}
                                  value={item?.deviceId}
                                  onClick={() => {
                                    setSelectedWebcam((s) => ({
                                      ...s,
                                      id: item?.deviceId,
                                      label: item?.label,
                                    }));
                                    changeWebcam(item?.deviceId);
                                  }}
                                >
                                  {item?.label ? (
                                    <span>{`${item?.label.substr(
                                      0,
                                      25
                                    )}...`}</span>
                                  ) : (
                                    <span>{`Webcam ${index + 1}`}</span>
                                  )}
                                </button>
                              </div>
                            )
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
}
