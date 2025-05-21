import React, { useEffect, useRef, useCallback, useState } from "react";
import AppSimpleBar from "../../../components/AppSimpleBar";
import Loader from "../../../components/Loader";
import Message from "../ConversationUser/Message";
import ForwardModal from "../../../components/ForwardModal";
import { MessagesTypes } from "../../../data/messages";
import MessageInput from "./MessageInput";
import { useSelector } from "react-redux";

// Definir los tipos de las props
interface ConversationPanelProps {
  messages: MessagesTypes[]; // Array de mensajes
  userProfile: any;
  chatContactDetails: any;
  isLoading: boolean;
  isChannel: boolean;
  onDelete: (messageId: string | number) => void;
  onSetReplyData: (reply: null | MessagesTypes | undefined) => void;
  onForward: (params: { message: MessagesTypes; contacts: any[] }) => void;
  onDeleteImage: (messageId: string | number, imageId: string | number) => void;
}

const ConversationPanel = ({
  messages,
  userProfile,
  chatContactDetails,
  isLoading,
  isChannel,
  onDelete,
  onSetReplyData,
  onForward,
  onDeleteImage,
}: ConversationPanelProps) => {
  const selectedConversation = useSelector(
    (state: any) => state.Chats.selectedConversation,
  );

  const scrollRef = useRef<any>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Scroll a bottom (usando scrollRef)
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const listEle = document.getElementById("chat-conversation-list");
      const offsetHeight = listEle?.scrollHeight || 0;
      scrollRef.current.getScrollElement().scrollTo({
        top: offsetHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Mostrar la flecha si no estamos al final
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current.getScrollElement();
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setShowScrollBtn(!nearBottom);
  };

  useEffect(() => {
    const scroller = scrollRef.current?.getScrollElement?.();
    if (scroller) {
      scroller.addEventListener("scroll", handleScroll);
      return () => scroller.removeEventListener("scroll", handleScroll);
    }
  }, [scrollRef.current]);

  const [forwardData, setForwardData] = useState<null | MessagesTypes>(null);
  const [isOpenForward, setIsOpenForward] = useState<boolean>(false);

  const onOpenForward = (message: MessagesTypes) => {
    setForwardData(message);
    setIsOpenForward(true);
  };

  const onCloseForward = () => setIsOpenForward(false);

  const handleForwardMessage = (data: any) => {
    if (forwardData) {
      onForward({ message: forwardData, contacts: data.contacts });
      setIsOpenForward(false);
    }
  };

  const safeChatContactDetails = chatContactDetails || {};

  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      {/* Panel scrollable de mensajes */}
      <div
        className="chat-message-area"
        style={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: "80px", // Espacio para el teclado
        }}
      >
        <AppSimpleBar
          scrollRef={scrollRef}
          className="chat-conversation p-3 p-lg-4 position-relative"
          style={{ height: "100%" }}
        >
          {isLoading && <Loader />}
          <ul
            className="list-unstyled chat-conversation-list"
            id="chat-conversation-list"
            style={{ marginBottom: 0 }}
          >
            {messages.map((message: MessagesTypes, key: number) => (
              <Message
                key={key}
                message={message}
                chatContactDetails={safeChatContactDetails}
                onDelete={() => onDelete(message.mId)}
                onSetReplyData={onSetReplyData}
                isFromMe={message.meta.sender + "" === userProfile.uid + ""}
                onOpenForward={onOpenForward}
                isChannel={isChannel}
                onDeleteImage={(messageId, imageId) =>
                  onDeleteImage(message.mId, imageId)
                }
              />
            ))}
          </ul>

          {/* Flechita de scroll */}
          {showScrollBtn && (
            <button
              style={{
                position: "absolute",
                right: 32,
                bottom: 32,
                background: "#ffffffcc",
                border: "1px solid #e0e0e0",
                borderRadius: "50%",
                boxShadow: "0 2px 8px #0001",
                padding: 10,
                zIndex: 20,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onClick={scrollToBottom}
              aria-label="Bajar al último mensaje"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#2ca1ff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}
        </AppSimpleBar>
      </div>

      {/* Input de mensajes fijo */}
      <div
        className="chat-message-input bg-white px-3 py-2"
        style={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "#fff",
          zIndex: 2,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        {selectedConversation?.id ? (
          <MessageInput
            conversationId={selectedConversation.id}
            userProfile={userProfile}
          />
        ) : (
          <div className="text-muted">
            Selecciona una conversación para empezar a chatear
          </div>
        )}
      </div>

      {isOpenForward && (
        <ForwardModal
          isOpen={isOpenForward}
          onClose={onCloseForward}
          forwardData={forwardData}
          chatContactDetails={safeChatContactDetails}
          onForward={handleForwardMessage}
        />
      )}
    </div>
  );
};

export default ConversationPanel;
