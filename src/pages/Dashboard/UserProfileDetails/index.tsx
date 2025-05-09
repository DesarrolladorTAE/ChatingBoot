import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { createSelector } from "reselect";
// hooks
import { useRedux } from "../../../hooks/index";

// actions
import {
  toggleUserDetailsTab,
  toggleFavouriteContact,
  getchatContactDetails,
  toggleArchiveContact,
} from "../../../redux/actions";

// components
import AudioCallModal from "../../../components/AudioCallModal";
import VideoCallModal from "../../../components/VideoCallModal";
import AppSimpleBar from "../../../components/AppSimpleBar";
import Loader from "../../../components/Loader";
import ProfileUser from "./ProfileUser";
import Actions from "./Actions";
import BasicDetails from "./BasicDetails";
import Groups from "./Groups";
import Media from "../../../components/Media";
import AttachedFiles from "../../../components/AttachedFiles";
import Status from "./Status";
import Members from "./Members";

interface IndexProps {
  isChannel: boolean;
}
const Index = ({ isChannel }: IndexProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();

  const errorData = createSelector(
    (state : any) => state.Chats,
   
    (state) => ({
      chatContactDetails: state.chatContactDetails,
      getUserDetailsLoading: state.getUserDetailsLoading,
      isOpenUserDetails: state.isOpenUserDetails,
      isFavouriteContactToggled: state.isFavouriteContactToggled,
    })
  );
  // Inside your component
  const { chatContactDetails,getUserDetailsLoading,isOpenUserDetails,isFavouriteContactToggled } = useAppSelector(errorData);

  useEffect(() => {
    if (isFavouriteContactToggled) {
      dispatch(getchatContactDetails(chatContactDetails.id));
    }
  }, [dispatch, isFavouriteContactToggled, chatContactDetails.id]);

  /*
  close tab
  */
  const onCloseUserDetails = () => {
    dispatch(toggleUserDetailsTab(false));
  };

    /*
    video call modal
    */
  const [isOpenVideoModal, setIsOpenVideoModal] = useState<boolean>(false);
  const onOpenVideo = () => {
    setIsOpenVideoModal(true);
  };
  const onCloseVideo = () => {
    setIsOpenVideoModal(false);
  };

  /*
  audio call modal  
  */
  const [isOpenAudioModal, setIsOpenAudioModal] = useState<boolean>(false);
  const onOpenAudio = () => {
    setIsOpenAudioModal(true);
  };
  const onCloseAudio = () => {
    setIsOpenAudioModal(false);
  };

  /*
  favourite
  */
  const onToggleFavourite = () => {
    dispatch(toggleFavouriteContact(chatContactDetails.id));
  };

  /*
  archive
  */
  const onToggleArchive = () => {
    dispatch(toggleArchiveContact(chatContactDetails.id));
  };

  return (
    <>
      <div
        className={classnames("user-profile-sidebar", {
          "d-block": isOpenUserDetails,
        })}
      >
        <div className="position-relative">
          {getUserDetailsLoading && <Loader />}

          <ProfileUser
            onCloseUserDetails={onCloseUserDetails}
            chatContactDetails={chatContactDetails}
            onOpenVideo={onOpenVideo}
            onOpenAudio={onOpenAudio}
          />
          {/* <!-- End profile user --> */}

          {/* <!-- Start user-profile-desc --> */}
          <AppSimpleBar className="p-4 user-profile-desc">
            {" "}
            {/* simplebar */}
            <Actions
              chatContactDetails={chatContactDetails}
              onOpenVideo={onOpenVideo}
              onOpenAudio={onOpenAudio}
              onToggleFavourite={onToggleFavourite}
              onToggleArchive={onToggleArchive}
            />
            <Status about={chatContactDetails.about} />
            {!isChannel ? (
              <>
                <BasicDetails chatContactDetails={chatContactDetails} />
                <hr className="my-4" />
                <Groups chatContactDetails={chatContactDetails} />
                <hr className="my-4" />
              </>
            ) : (
              <>
                <Members chatContactDetails={chatContactDetails} />
                <hr className="my-4" />
              </>
            )}
            <Media media={chatContactDetails.media} limit={3} />
            <hr className="my-4" />
            <AttachedFiles attachedFiles={chatContactDetails.attachedFiles} />
          </AppSimpleBar>
          {/* <!-- end user-profile-desc --> */}
          {isOpenAudioModal && (
            <AudioCallModal
              isOpen={isOpenAudioModal}
              onClose={onCloseAudio}
              user={chatContactDetails}
            />
          )}
          {isOpenVideoModal && (
            <VideoCallModal
              isOpen={isOpenVideoModal}
              onClose={onCloseVideo}
              user={chatContactDetails}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
