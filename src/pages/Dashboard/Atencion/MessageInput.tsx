import React, { useState, KeyboardEvent, ChangeEvent, useRef } from "react";
import { InputGroup, Input, Button } from "reactstrap";
import { useRedux } from "../../../hooks";
import { onSendMessage } from "../../../redux/chats/actions";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { BsPaperclip, BsEmojiSmile } from "react-icons/bs";

interface MessageInputProps {
  conversationId: number | string;
  userProfile: { uid: number | string; [key: string]: any };
}

const MessageInput: React.FC<MessageInputProps> = ({
  conversationId,
  userProfile,
}) => {
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { dispatch } = useRedux();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLInputElement | null>(null);

  // Emoji click: Inserta en posición del cursor
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (!textareaRef.current) {
      setMessage(prev => prev + emojiData.emoji);
    } else {
      const input = textareaRef.current;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newValue =
        message.substring(0, start) + emojiData.emoji + message.substring(end);
      setMessage(newValue);

      // Establece el cursor justo después del emoji
      setTimeout(() => {
        input.selectionStart = input.selectionEnd =
          start + emojiData.emoji.length;
        input.focus();
      }, 0);
    }
    setShowEmojiPicker(false);
  };

  // Enviar mensaje (texto o archivo)
  const handleSend = () => {
    if (!message.trim() && !file) return;

    console.log("Enviando datos", {
      message,
      type: file ? "file" : "text", // Determinamos el tipo de mensaje
    });

    if (file) {
      const formData = new FormData();
      formData.append("conversation_id", conversationId.toString());
      formData.append("sender_id", userProfile.uid.toString());
      formData.append("type", "file");
      formData.append("file", file);
      if (message.trim()) {
        formData.append("content", message.trim());
      }
      dispatch(onSendMessage(formData));
    } else {
      dispatch(
        onSendMessage({
          conversation_id: conversationId,
          content: message,
          sender_id: userProfile.uid,
          type: "text",
        }),
      );
    }
    setMessage("");
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // reset input file
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("Archivo demasiado grande (máx 5MB)");
        return;
      }
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      {/* Previsualización de archivo si hay */}
      {file && (
        <div className="mb-2 d-flex align-items-center gap-2">
          {filePreview ? (
            <img
              src={filePreview}
              alt="preview"
              height={40}
              style={{ borderRadius: 4 }}
            />
          ) : (
            <span>{file.name}</span>
          )}
          <Button size="sm" color="danger" onClick={handleRemoveFile}>
            Quitar
          </Button>
        </div>
      )}

      <div style={{ position: "relative", width: "100%" }}>
        {/* Picker flotante */}
        {showEmojiPicker && (
          <div
            style={{ position: "absolute", bottom: 56, left: 0, zIndex: 100 }}
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={Theme.LIGHT} // O Theme.DARK
              searchDisabled={false}
              width={320}
            />
          </div>
        )}

        <InputGroup>
          {/* Botón emoji */}
          <Button
            color="secondary"
            outline
            onClick={() => setShowEmojiPicker(val => !val)}
            style={{ marginRight: 4 }}
            title="Insertar emoji"
            type="button"
          >
            <BsEmojiSmile size={18} />
          </Button>

          {/* Botón de adjuntar archivo */}
          <Button
            color="secondary"
            outline
            onClick={() => fileInputRef.current?.click()}
            style={{ marginRight: 4 }}
            title="Adjuntar archivo"
            type="button"
          >
            <BsPaperclip size={18} />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
          <Input
            type="textarea"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            rows={1}
            style={{ resize: "none" }}
            innerRef={textareaRef}
          />
          <Button
            color="primary"
            onClick={handleSend}
            disabled={!message.trim() && !file}
          >
            Enviar
          </Button>
        </InputGroup>
      </div>
    </>
  );
};

export default MessageInput;
