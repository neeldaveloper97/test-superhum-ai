import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useMediaQuery } from "react-responsive";
import { useIsMobile } from "../../../hooks/useIsMobile";

import { useIsTab } from "../../../hooks/useIsTab";
import { useVideoCfcContext } from "../../../context/VideoCfcContext";
import { SideBarTabView } from "./SideBarTabView";

export const Sidebar = ({ height, sideBarContainerWidth }) => {
  const { raisedHandsParticipants, sideBarMode, setSideBarMode } =
    useVideoCfcContext();
  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const isLGDesktop = useMediaQuery({ minWidth: 1024, maxWidth: 1439 });
  const isXLDesktop = useMediaQuery({ minWidth: 1440 });

  const panelPadding = 8;

  const paddedHeight = height - panelPadding * 3.5;

  const panelHeaderHeight = isMobile
    ? 40
    : isTab
    ? 44
    : isLGDesktop
    ? 48
    : isXLDesktop
    ? 52
    : 0;

  const panelHeaderPadding = isMobile
    ? 6
    : isTab
    ? 8
    : isLGDesktop
    ? 10
    : isXLDesktop
    ? 12
    : 0;

  const handleClose = () => {
    setSideBarMode(null);
  };

  return sideBarMode ? (
    isTab || isMobile ? (
      <Transition appear show={sideBarMode ? true : false} as={Fragment}>
        <Dialog
          as="div"
          className="relative"
          style={{ zIndex: 9999 }}
          onClose={handleClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-y-full opacity-0 scale-95"
            enterTo="translate-y-0 opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0 opacity-100 scale-100"
            leaveTo="translate-y-full opacity-0 scale-95"
          >
            <div className="fixed inset-0 overflow-y-hidden">
              <div className="flex h-screen items-center justify-center text-center">
                <Dialog.Panel className="w-screen transform overflow-hidden bg-gray-800 shadow-xl transition-all">
                  <SideBarTabView
                    height={"100%"}
                    sideBarContainerWidth={"100%"}
                    panelHeight={height}
                    raisedHandsParticipants={raisedHandsParticipants}
                    panelHeaderHeight={panelHeaderHeight}
                    panelHeaderPadding={panelHeaderPadding}
                    panelPadding={panelPadding}
                    handleClose={handleClose}
                  />
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    ) : (
      <SideBarTabView
        height={paddedHeight}
        sideBarContainerWidth={sideBarContainerWidth}
        panelHeight={paddedHeight - panelHeaderHeight - panelHeaderPadding}
        raisedHandsParticipants={raisedHandsParticipants}
        panelHeaderHeight={panelHeaderHeight}
        panelHeaderPadding={panelHeaderPadding}
        panelPadding={panelPadding}
        handleClose={handleClose}
      />
    )
  ) : (
    <></>
  );
};
