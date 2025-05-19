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
    chatContactDetails: chats.selectedConversation?.contact || {},
  }),
);

interface Props {
  selectedTicket: any;
}

const ConversationWithRedux = ({ selectedTicket }: Props) => {
  const { dispatch, useAppSelector } = useRedux();
  const { userProfile } = useProfile();
  const { isLoading, messages, chatContactDetails } =
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
    dispatch(deleteImage(chatContactDetails.id, messageId, imageId));
  };

  console.log("🔎 Mensajes que llegan del store:", messages);
  console.log("🧑 Contacto en chatContactDetails:", chatContactDetails);

  if (!userProfile || !userProfile.uid) {
    return (
      <div className="text-center text-muted py-5">
        Debes iniciar sesión o seleccionar un usuario válido.
      </div>
    );
  }

  return (
    <ConversationPanel
      messages={messages}
      userProfile={userProfile}
      chatContactDetails={chatContactDetails} // << nombre actualizado
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
