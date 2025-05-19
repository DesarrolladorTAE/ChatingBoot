import React, { useEffect, useRef, useCallback, useState } from "react";
import AppSimpleBar from "../../../components/AppSimpleBar";
import Loader from "../../../components/Loader";
import Message from "../ConversationUser/Message";
import ForwardModal from "../../../components/ForwardModal";
import { MessagesTypes } from "../../../data/messages";
import MessageInput from "./MessageInput";

import { useSelector } from "react-redux";

// Ahora sí puedes usar selectedConversation.id, selectedConversation.messages, etc.

interface ConversationPanelProps {
  messages: MessagesTypes[];
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

  const [forwardData, setForwardData] = useState<null | MessagesTypes>(null);
  const [isOpenForward, setIsOpenForward] = useState<boolean>(false);

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

  const onOpenForward = (message: MessagesTypes) => {
    setForwardData(message);
    setIsOpenForward(true);
  };

  const onCloseForward = () => {
    setIsOpenForward(false);
  };

  const handleForwardMessage = (data: any) => {
    if (forwardData) {
      onForward({ message: forwardData, contacts: data.contacts });
      setIsOpenForward(false);
    }
  };

  const safeChatContactDetails = chatContactDetails || {}; // fallback para evitar crash en Message

  return (
    <AppSimpleBar
      scrollRef={scrollRef}
      className="chat-conversation p-3 p-lg-4 position-relative"
    >
      {isLoading && <Loader />}
      <ul
        className="list-unstyled chat-conversation-list"
        id="chat-conversation-list"
      >
        {messages.map((message, key) => (
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

      {/* 👇 Aquí agregas el input de mensajes */}
      <div className="mt-3">
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
    </AppSimpleBar>
  );
};

export default ConversationPanel;
