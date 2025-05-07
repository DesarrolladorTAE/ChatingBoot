import React, { useEffect } from "react";
import { useRedux } from "../../../hooks";
import { createSelector } from "reselect";
import { useProfile } from "../../../hooks";
import ConversationPanel from "./ConversationPanel";
import { forwardMessage, deleteImage } from "../../../redux/actions";

// El estado del store que necesita Conversation
const selectChatState = createSelector(
  (state: any) => state.Chats,
  chats => ({
    isLoading: chats.getUserConversationsLoading,
    messages: chats.selectedConversation?.messages || [],
    chatUserDetails: chats.selectedConversation?.user || {},
  }),
);

interface Props {
  selectedTicket: any;
}

const ConversationWithRedux = ({ selectedTicket }: Props) => {
  const { dispatch, useAppSelector } = useRedux();
  const { userProfile } = useProfile();
  const { isLoading, messages, chatUserDetails } =
    useAppSelector(selectChatState);

  const handleDelete = (messageId: string | number) => {
    dispatch({ type: "DELETE_MESSAGE", payload: { messageId } });
  };

  const handleSetReplyData = (reply: any) => {
    dispatch({ type: "SET_REPLY_DATA", payload: reply });
  };

  const handleForward = (data: any) => {
    dispatch(forwardMessage(data));
  };

  // Opcional: log para verificar
  console.log("🔁 Conversación activa para:", selectedTicket?.name);

  const handleDeleteImage = (
    messageId: string | number,
    imageId: string | number,
  ) => {
    dispatch(deleteImage(chatUserDetails.id, messageId, imageId));
  };

  return (
    <ConversationPanel
      messages={messages}
      userProfile={userProfile}
      chatUserDetails={chatUserDetails}
      isLoading={isLoading}
      isChannel={false}
      onDelete={handleDelete}
      onSetReplyData={handleSetReplyData}
      onForward={handleForward}
      onDeleteImage={handleDeleteImage}
    />
  );
};

export default ConversationWithRedux;
