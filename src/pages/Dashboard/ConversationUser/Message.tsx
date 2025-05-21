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

function isImageOrSticker(filename: string = ""): boolean {
  return /\.(webp|png|jpg|jpeg|gif)$/i.test(filename);
}

function isArchivoRecibido(text?: string) {
  return text && text.trim() === "[Archivo recibido]";
}

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
  imagelink: any;
  onReply: () => any;
  onDelete: () => void;
}
const ImageMoreMenu = ({
  imagelink,
  onReply,
  onDelete,
}: ImageMoreMenuProps) => {
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
  message: MessagesTypes;
  image: ImageTypes;
  onImageClick: (id: number) => void;
  index: number;
  onSetReplyData: (reply: null | MessagesTypes | undefined) => void;
  onDeleteImg: (imageId: string | number) => void;
}
const Image = ({
  message,
  image,
  onImageClick,
  index,
  onSetReplyData,
  onDeleteImg,
}: ImageProps) => {
  const onDelete = () => {
    onDeleteImg(image.id);
  };

  const onClickReply = () => {
    let multiimages: any = message["image"];
    let results = multiimages.filter(
      (multiimage: any) => multiimage.id === image.id,
    );
    message["newimage"] = results;
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
            <img
              src={image.download_link}
              alt="image"
              className="rounded border"
            />{" "}
            {/* Asegúrate de usar downloadLink */}
          </Link>
        </div>
        <ImageMoreMenu
          imagelink={image.download_link}
          onReply={onClickReply}
          onDelete={onDelete}
        />
      </div>
    </React.Fragment>
  );
};
interface ImagesProps {
  message: MessagesTypes;
  images: ImageTypes[];
  onSetReplyData: (reply: null | MessagesTypes | undefined) => void;
  onDeleteImg: (imageId: string | number) => void;
}
const Images = ({
  message,
  images = [], // Asignamos un array vacío por defecto si images es undefined
  onSetReplyData,
  onDeleteImg,
}: ImagesProps) => {
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
        {images.map((image: ImageTypes, index: number) => (
          <Image
            key={image.id} // Usamos un ID único para cada imagen
            message={message}
            image={image}
            index={index} // Pasamos el índice como propiedad
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
                    href={
                      attachment.download_link ? attachment.download_link : "#"
                    }
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
  chatContactDetails: any;
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
  chatContactDetails,
  onDelete,
  onSetReplyData,
  isFromMe,
  onOpenForward,
  isChannel,
  onDeleteImage,
}: MessageProps) => {
  const { userProfile } = useProfile();

  // Verificamos si userProfile existe
  if (!userProfile) {
    console.warn("⚠️ userProfile llegó como null o undefined en Message.tsx", {
      message,
    });
    return null;
  }

  const isSticker = message.type === "sticker";
  const hasImages = message.image && message.image.length > 0;
  const hasText = message.content;
  const hasAttachments = message.attachments && message.attachments.length;

  const date = formateDate(
    message.sent_at ? message.sent_at.replace(" ", "T") : "",
    "hh:mmaaa",
  );

  const onDeleteMessage = () => {
    onDelete(message.mId);
  };

  const onClickReply = () => {
    onSetReplyData(message);
  };

  const onForwardMessage = () => {
    onOpenForward(message);
  };

  const onDeleteImg = (imageId: number | string) => {
    onDeleteImage(message.mId, imageId);
  };

  return (
    <li className={classnames("chat-list", { right: isFromMe })}>
      <div className="conversation-list">
        <div className="chat-avatar">
          <img
            src={
              isFromMe
                ? userProfile.profileImage || imagePlaceholder
                : chatContactDetails?.profileImage || imagePlaceholder
            }
            alt="Profile"
          />
        </div>

        <div
          className={classnames("user-chat-content", {
            "bg-light-gray": !isFromMe, // Fondo claro para mensajes recibidos
            "bg-dark-blue": isFromMe, // Fondo oscuro para mensajes enviados
            "border-radius": true, // Bordes redondeados
            "p-2": true, // Padding para espaciado
            "box-shadow": true, // Sombra alrededor de los mensajes
          })}
        >
          {/* Mensaje reenviado */}
          {message.meta?.isForwarded && (
            <span
              className={classnames(
                "me-1",
                "text-muted",
                "font-size-13",
                "mb-1",
                "d-block",
              )}
            >
              <i
                className={classnames(
                  "ri",
                  "ri-share-forward-line",
                  "align-middle",
                  "me-1",
                )}
              ></i>
              Forwarded
            </span>
          )}

          <div className="ctext-wrap-content">
            {/* Sticker: SOLO una vez, cuando el tipo es sticker */}
            {isSticker &&
              message.attachments &&
              message.attachments.length > 0 && (
                <img
                  src={message.attachments[0].download_link}
                  alt="Sticker"
                  className="message-sticker"
                  style={{ maxWidth: 180, borderRadius: 8, margin: 8 }}
                />
              )}

            {/* Imágenes recibidas (solo si NO es sticker) */}
            {!isSticker &&
              message.attachments &&
              message.attachments.length > 0 &&
              message.attachments
                .filter(att => isImageOrSticker(att.name))
                .map((att, idx) => (
                  <img
                    key={idx}
                    src={att.download_link}
                    alt={att.name}
                    className="message-image"
                    style={{ maxWidth: 180, borderRadius: 8, margin: 8 }}
                  />
                ))}

            {/* Texto (solo si NO es sticker y el texto no es "[Archivo recibido]") */}
            {hasText && !isSticker && !isArchivoRecibido(message.content) && (
              <p className="mb-0 ctext-content">{message.content}</p>
            )}

            {/* Imágenes (compatibilidad con legacy Images[]) */}
            {hasImages && (
              <Images
                images={message.image || []}
                message={message}
                onSetReplyData={onSetReplyData}
                onDeleteImg={onDeleteImg}
              />
            )}

            {/* Archivos adjuntos (los no-imagen) */}
            {hasAttachments && (
              <Attachments attachments={message.attachments} />
            )}
          </div>

          {/* Menú para opciones de mensaje */}
          <Menu
            onForward={onForwardMessage}
            onDelete={onDeleteMessage}
            onReply={onClickReply}
          />
        </div>

        <div className="conversation-name">
          {isFromMe ? (
            <>
              <span
                className={classnames("me-1", {
                  "text-success": message.meta?.read,
                })}
              >
                <i
                  className={classnames(
                    "bx",
                    { "bx-check-double": message.meta?.read },
                    { "bx-check": message.meta?.sent },
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
              {chatContactDetails.firstName}
              <small className={classnames("text-muted", "mb-0", "ms-2")}>
                {date}
              </small>
            </>
          )}
        </div>
      </div>
    </li>
  );
};

export default Message;
