import React, { useState } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import classnames from "classnames";
import { Link } from "react-router-dom";

// components
import LightBox from "../../../components/LightBox";

//images
import imagePlaceholder from "../../../assets/images/users/user-dummy-img.jpg";

// interface
import {
  MessagesTypes,
  ImageTypes,
  AttachmentTypes,
} from "../../../data/messages";

// hooks
import { useProfile } from "../../../hooks";

// utils
import { formateDate } from "../../../utils";
import RepliedMessage from "./RepliedMessage";

interface MenuProps {
  onDelete: () => any;
  onReply: () => any;
  onForward: () => void;
}

const Menu = ({ onDelete, onReply, onForward }: MenuProps) => {
  console.log("Renderizando Menu", { onDelete, onReply, onForward });
  return (
    <UncontrolledDropdown className="align-self-start message-box-drop">
      <DropdownToggle className="btn btn-toggle" role="button" tag={"a"}>
        <i className="ri-more-2-fill"></i>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          to="#"
          onClick={onReply}
        >
          Reply <i className="bx bx-share ms-2 text-muted"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          to="#"
          onClick={onForward}
        >
          Forward <i className="bx bx-share-alt ms-2 text-muted"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          to="#"
        >
          Copy <i className="bx bx-copy text-muted ms-2"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          to="#"
        >
          Bookmark <i className="bx bx-bookmarks text-muted ms-2"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          to="#"
        >
          Mark as Unread <i className="bx bx-message-error text-muted ms-2"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex align-items-center justify-content-between delete-item"
          onClick={onDelete}
        >
          Delete <i className="bx bx-trash text-muted ms-2"></i>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};
interface ImageMoreMenuProps {
  imagelink: any,
  onReply: () => any;
  onDelete: () => void;
}
const ImageMoreMenu = ({ imagelink,onReply, onDelete }: ImageMoreMenuProps) => {
  console.log("Renderizando ImageMoreMenu", { imagelink });
  return (
    <div className="message-img-link">
      <ul className="list-inline mb-0">
        <UncontrolledDropdown
          tag="li"
          color="none"
          className="list-inline-item dropdown"
        >
          <DropdownToggle tag="a" role="button" className="btn btn-toggle">
            <i className="bx bx-dots-horizontal-rounded"></i>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              className="dropdown-item d-flex align-items-center justify-content-between"
              href={imagelink}
              download
            >
              Download <i className="bx bx-download ms-2 text-muted"></i>
            </DropdownItem>
            <DropdownItem
              tag="a"
              className=" d-flex align-items-center justify-content-between"
              href="#"
              onClick={onReply}
            >
              Reply <i className="bx bx-share ms-2 text-muted"></i>
            </DropdownItem>
            <DropdownItem
              tag="a"
              className=" d-flex align-items-center justify-content-between"
              href="#"
              data-bs-toggle="modal"
              data-bs-target=".forwardModal"
            >
              Forward <i className="bx bx-share-alt ms-2 text-muted"></i>
            </DropdownItem>
            <DropdownItem
              tag="a"
              className=" d-flex align-items-center justify-content-between"
              href="#"
            >
              Bookmark <i className="bx bx-bookmarks text-muted ms-2"></i>
            </DropdownItem>
            <DropdownItem
              tag="a"
              className=" d-flex align-items-center justify-content-between delete-item"
              href="#"
              onClick={onDelete}
            >
              Delete <i className="bx bx-trash ms-2 text-muted"></i>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </ul>
    </div>
  );
};

interface ImageProps {
  message : MessagesTypes,
  image: ImageTypes;
  onImageClick: (id: number) => void;
  index: number;
  onSetReplyData: (reply: null | MessagesTypes | undefined) => void;
  onDeleteImg: (imageId: string | number) => void;
}
const Image = ({ message ,image, onImageClick, index,onSetReplyData, onDeleteImg }: ImageProps) => {
  const onDelete = () => {
    onDeleteImg(image.id);
  };
  const onClickReply = () => {
    console.log("Se hizo clic en Reply para la imagen con id:", image.id);
    let multiimages: any = message['image'];

    let results = multiimages.filter((multiimage : any) => multiimage.id === image.id);

    message['newimage'] = results;

    onSetReplyData(message);

  };
  return (
    <React.Fragment>
      <div className="message-img-list">
        <div>
          <Link
            className="popup-img d-inline-block"
            to={"#"}
            onClick={() => onImageClick(index)}
          >
            <img src={image.downloadLink} alt="" className="rounded border" />
          </Link>
        </div>
        <ImageMoreMenu imagelink={image.downloadLink} onReply={onClickReply} onDelete={onDelete} />
      </div>
    </React.Fragment>
  );
};
interface ImagesProps {
  message : MessagesTypes,
  images: ImageTypes[];
  onSetReplyData: (reply: null | MessagesTypes | undefined) => void;
  onDeleteImg: (imageId: string | number) => void;
}
const Images = ({ message,images,onSetReplyData, onDeleteImg }: ImagesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const onImageClick = (id: number) => {
    setSelected(id);
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="message-img mb-0">
        {(images || []).map((image: ImageTypes, key: number) => (
            <Image
              message={message}
              image={image}
              key={key}
              index={key}
              onImageClick={onImageClick}
              onSetReplyData={onSetReplyData}
              onDeleteImg={onDeleteImg}
            />
        ))}
      </div>
      {isOpen && (
        <LightBox
          isOpen={isOpen}
          images={images}
          onClose={onClose}
          defaultIdx={selected}
        />
      )}
    </>
  );
};

interface AttachmentsProps {
  attachments: AttachmentTypes[] | undefined;
}
const Attachments = ({ attachments }: AttachmentsProps) => {
  return (
    <>
      {(attachments || []).map((attachment: AttachmentTypes, key: number) => (
        <div
          key={key}
          className={classnames("p-3", "border-primary", "border rounded-3", {
            "mt-2": key !== 0,
          })}
        >
          <div className="d-flex align-items-center attached-file">
            <div className="flex-shrink-0 avatar-sm me-3 ms-0 attached-file-avatar">
              <div className="avatar-title bg-primary-subtle text-primary rounded-circle font-size-20">
                <i className="ri-attachment-2"></i>
              </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
              <div className="text-start">
                <h5 className="font-size-14 mb-1">{attachment.name}</h5>
                <p className="text-muted text-truncate font-size-13 mb-0">
                  {attachment.desc}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 ms-4">
              <div className="d-flex gap-2 font-size-20 d-flex align-items-start">
                <div>
                  <a
                    href={attachment.downloadLink ? attachment.downloadLink : "#"}
                    className="text-muted"
                    download
                  >
                    <i className="bx bxs-download"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

const Typing = () => {
  return (
    <p className="mb-0">
      typing
      <span className="animate-typing">
        <span className="dot mx-1"></span>
        <span className="dot me-1"></span>
        <span className="dot"></span>
      </span>
    </p>
  );
};
interface MessageProps {
  message: MessagesTypes;
  chatUserDetails: any;
  onDelete: (messageId: string | number) => any;
  onSetReplyData: (reply: null | MessagesTypes | undefined) => void;
  isFromMe: boolean;
  onOpenForward: (message: MessagesTypes) => void;
  isChannel: boolean;
  onDeleteImage: (messageId: string | number, imageId: string | number) => void;
  // onSetReplyImageData: () => void;
}
const Message = ({
  message,
  chatUserDetails,
  onDelete,
  onSetReplyData,
  isFromMe,
  onOpenForward,
  isChannel,
  onDeleteImage,
}: MessageProps) => {
  console.log("Renderizando Message", {
    message: message,
    isFromMe: isFromMe,
    hasImages: message.image && message.image.length,
    hasText: message.text,
  });
  const { userProfile } = useProfile();
  const hasImages = message.image && message.image.length;
  const hasAttachments = message.attachments && message.attachments.length;
  const hasText = message.text;
  const isTyping = false;

  const chatUserFullName = chatUserDetails.firstName
    ? `${chatUserDetails.firstName} ${chatUserDetails.lastName}`
    : "-";

  const myProfile = userProfile.profileImage
    ? userProfile.profileImage
    : imagePlaceholder;
  const channeluserProfile =
    message.meta.userData && message.meta.userData.profileImage
      ? message.meta.userData.profileImage
      : imagePlaceholder;
  const chatUserprofile = chatUserDetails.profileImage
    ? chatUserDetails.profileImage
    : imagePlaceholder;
  const profile = isChannel ? channeluserProfile : chatUserprofile;
  const date = formateDate(message.time, "hh:mmaaa");
  const isSent = message.meta.sent;
  const isReceived = message.meta.received;
  const isRead = message.meta.read;
  const isForwarded = message.meta.isForwarded;
  const channdelSenderFullname = message.meta.userData
    ? `${message.meta.userData.firstName} ${message.meta.userData.lastName}`
    : "-";
  const fullName = isChannel ? channdelSenderFullname : chatUserFullName;
  const onDeleteMessage = () => {
    onDelete(message.mId);
  };

  const onClickReply = () => {
    onSetReplyData(message);
  };
  const isRepliedMessage = message.replyOf;

  const onForwardMessage = () => {
    onOpenForward(message);
  };

  const onDeleteImg = (imageId: number | string) => {
    onDeleteImage(message.mId, imageId);
  };
  return (
    <li
      className={classnames(
        "chat-list",
        { right: isFromMe },
        { reply: isRepliedMessage }
      )}
    >
      <div className="conversation-list">
        <div className="chat-avatar">
          <img src={isFromMe ? myProfile : profile} alt="" />
        </div>

        <div className="user-chat-content">
          {hasImages && message.text && (
            <div className="ctext-wrap">
              <div className="ctext-wrap-content">
                <p className="mb-0 ctext-content">{message.text}</p>
              </div>
            </div>
          )}
          {isForwarded && (
            <span
              className={classnames(
                "me-1",
                "text-muted",
                "font-size-13",
                "mb-1",
                "d-block"
              )}
            >
              <i
                className={classnames(
                  "ri",
                  "ri-share-forward-line",
                  "align-middle",
                  "me-1"
                )}
              ></i>
              Forwarded
            </span>
          )}

          <div className="ctext-wrap">
            {/* text message end */}

            {/* image message start */}
            {hasImages ? (
              <>
                <Images images={message.image!} message={message} onSetReplyData={onSetReplyData} onDeleteImg={onDeleteImg} />
              </>
            ) : (
              <>
                <div className="ctext-wrap-content">
                  {isRepliedMessage && (
                    <RepliedMessage
                      fullName={fullName}
                      message={message}
                      isFromMe={isFromMe}
                    />
                  )}

                  {hasText && (
                    <p className="mb-0 ctext-content">{message.text}</p>
                  )}

                  {/* typing start */}
                  {isTyping && <Typing />}

                  {/* typing end */}
                  {/* files message start */}
                  {hasAttachments && (
                    <Attachments attachments={message.attachments} />
                  )}
                  {/* files message end */}
                </div>
                {console.log("Renderizando Menu en mensaje sin imágenes")}
                <Menu
                  onForward={onForwardMessage}
                  onDelete={onDeleteMessage}
                  onReply={onClickReply}
                />
              </>
            )}

            {/* image message end */}
          </div>
          <div className="conversation-name">
            {isFromMe ? (
              <>
                <span
                  className={classnames(
                    "me-1",
                    { "text-success": isRead },
                    { "text-muted": (isSent || isReceived) && !isRead }
                  )}
                >
                  <i
                    className={classnames(
                      "bx",
                      { "bx-check-double": isRead || isReceived },
                      { "bx-check": isSent }
                    )}
                  ></i>
                </span>
                <small className={classnames("text-muted", "mb-0", "me-2")}>
                  {date}
                </small>
                You
              </>
            ) : (
              <>
                {fullName}
                <small className={classnames("text-muted", "mb-0", "ms-2")}>
                  {date}
                </small>
              </>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default Message;
