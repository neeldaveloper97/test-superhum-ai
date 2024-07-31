import { Popover, Transition } from "@headlessui/react";
import { IoChevronDown, IoCheckmarkDoneSharp } from "react-icons/io5";
import { Fragment } from "react";
import { useState } from "react";
import test_sound from "../../sounds/test_sound.mp3";
import { PiSpeakerNoneFill } from "react-icons/pi";
import { useVideoCfcContext } from "../../context/VideoCfcContext";

export const DropDownSpeaker = ({ speakers }) => {
  const { setSelectedSpeaker, selectedSpeaker, isMicrophonePermissionAllowed } =
    useVideoCfcContext();
  const [audioProgress, setAudioProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const testSpeakers = () => {
    const selectedSpeakerDeviceId = selectedSpeaker.id;
    if (selectedSpeakerDeviceId) {
      const audio = new Audio(test_sound);
      try {
        audio.setSinkId(selectedSpeakerDeviceId).then(() => {
          audio.play();
          setIsPlaying(true);
          audio.addEventListener("timeupdate", () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            setAudioProgress(progress);
          });
          audio.addEventListener("ended", () => {
            setAudioProgress(0);
            setIsPlaying(false);
          });
        });
      } catch (error) {
        console.log(error);
      }
      audio.play().catch((error) => {
        console.error("Failed to set sinkId:", error);
      });
    } else {
      console.error("Selected speaker deviceId not found.");
    }
  };

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
              disabled={!isMicrophonePermissionAllowed}
              className={`focus:outline-none hover:ring-1 
              ${
                open
                  ? "text-white ring-1 ring-gray-250"
                  : "text-customGray-250 hover:text-white"
              }
              group flex items-center rounded-md px-3 py-1 w-44 text-base font-normal bg-indigo-700 rounded shadow-md
              ${!isMicrophonePermissionAllowed ? "opacity-50" : ""}`}
            >
              <PiSpeakerNoneFill />
              <span className=" overflow-hidden whitespace-nowrap overflow-ellipsis w-28 ml-6">
                {isMicrophonePermissionAllowed
                  ? selectedSpeaker?.label
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
              <Popover.Panel className="absolute bottom-full z-10 mt-3 w-72 sm:px-0 pb-2">
                <div className="rounded-lg shadow-lg">
                  <div className={"rounded-lg"}>
                    <div className="bg-gray-800 rounded-md py-3 px-3">
                      <div className="flex flex-col items-center">
                        {speakers.map((item, index) => {
                          return (
                            item?.kind === "audiooutput" && (
                              <div
                                key={`speaker_${index}`}
                                className={` my-1 text-white text-left flex text-sm relative w-full`}
                              >
                                <span className="flex items-center justify-center absolute right-5 bottom-3">
                                  {selectedSpeaker?.label === item?.label && (
                                    <IoCheckmarkDoneSharp color="lime" />
                                  )}
                                </span>
                                <button
                                  className={`flex flex-1 w-full text-left bg-indigo-700 rounded-full`}
                                  value={item?.deviceId}
                                  onClick={() => {
                                    setSelectedSpeaker((s) => ({
                                      ...s,
                                      id: item?.deviceId,
                                      label: item?.label,
                                    }));
                                  }}
                                >
                                  {item?.label ? (
                                    <span>{`${item?.label.substr(
                                      0,
                                      30
                                    )}...`}</span>
                                  ) : (
                                    <span>{`Speaker ${index + 1}`}</span>
                                  )}
                                </button>
                              </div>
                            )
                          );
                        })}
                        {speakers.length && (
                          <>
                            <div className={`my-1 text-white text-left w-full`}>
                              <button
                                className={`flex items-center w-full text-left focus:outline-none bg-indigo-700 rounded-full`}
                                onClick={testSpeakers}
                              >
                                <span className="">
                                  <PiSpeakerNoneFill />
                                </span>
                                {isPlaying ? (
                                  <div className="bg-gray-450 rounded-full h-2 dark:bg-gray-700">
                                    <div
                                      className="bg-white opacity-50 h-2 rounded-full border"
                                      style={{ width: `${audioProgress}%` }}
                                    ></div>
                                  </div>
                                ) : (
                                  <span style={{fontSize: "14px"}}>Test Speakers</span>
                                )}
                              </button>
                            </div>
                          </>
                        )}
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
};
