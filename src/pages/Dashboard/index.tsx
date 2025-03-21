import React, { useState, useEffect } from "react";
import classnames from "classnames";

// hooks
import { useRedux } from "../../hooks/index";
import { useConversationUserType } from "../../hooks/index";
import { createSelector } from "reselect";

// components
import Leftbar from "./Leftbar";
import ConversationUser from "./ConversationUser/index";
import UserProfileDetails from "./UserProfileDetails/index";
import Welcome from "./ConversationUser/Welcome";
//Atención
import Atenciones from "./Atencion/Atenciones";
import RespuestasRapidas from "./Atencion/RespuestasRapidas";

// redux actions
import { setSelectedSection } from "../../redux/atencion/actions";

interface IndexProps {}

const Index = (props: IndexProps) => {
  const { useAppSelector, dispatch } = useRedux();
  const { isChannel } = useConversationUserType();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Selectors for Redux state
  const selectedChat = useAppSelector((state: any) => state.Chats.selectedChat);
  const selectedSection = useAppSelector((state: any) => 
    state.Atencion?.selectedSection || null
  );

  // Toggle collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle section changes from Leftbar
  const handleSectionChange = (section: string | null) => {
    console.log("Index: handleSectionChange called with section:", section);
    dispatch(setSelectedSection(section || ""));
  };

  // Render content based on selected chat or section
  const renderContent = () => {
    console.log(
      "Index: renderContent. selectedSection:",
      selectedSection,
      "selectedChat:",
      selectedChat,
    );

    if (selectedChat !== null) {
      return (
        <div className="chat-content d-lg-flex">
          <div className="w-100 overflow-hidden position-relative">
            <ConversationUser isChannel={isChannel} />
          </div>
          <UserProfileDetails isChannel={isChannel} />
        </div>
      );
    } 
    
    // Handle sections - use lowercase consistently for comparison
    switch(selectedSection?.toLowerCase()) {
      case "atenciones":
        return <Atenciones />;
      case "respuestas rapidas":
        return <RespuestasRapidas />;
      default:
        return <Welcome />;
    }
  };

  return (
    <>
      {/* Leftbar with section change handler */}
      <Leftbar 
        onToggleCollapse={toggleCollapse} 
        onSectionChange={handleSectionChange} 
      />

      {/* Main content area */}
      <div
        className={classnames("user-chat", "w-100", "overflow-hidden", {
          "user-chat-show": selectedChat,
          "user-chat-expanded": isCollapsed,
        })}
        id="user-chat"
      >
        <div className="user-chat-overlay" id="user-chat-overlay"></div>
        {renderContent()}
      </div>
    </>
  );
};

export default Index;