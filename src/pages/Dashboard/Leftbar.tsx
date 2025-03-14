import React, { useState } from "react";
import { TabContent, TabPane } from "reactstrap";

// hooks
import { useRedux } from "../../hooks/index";
import { createSelector } from "reselect";
// constants
import { TABS } from "../../constants/index";

// component
import Profile from "./Profile/index";
//import Chats from "./Chats/index";
import Contacts from "./Contacts/index";
import Calls from "./Calls/index";
import Bookmark from "./Bookmark/index";
import Settings from "./Settings/index";
import Atencion from "./Atencion";
//import Atencion from "./Atencion/index";

interface LeftbarProps {
  onToggleCollapse: () => void; // Prop para manejar el colapso
}

// const Leftbar = (props: LeftbarProps)=> {

const Leftbar: React.FC<LeftbarProps> = ({ onToggleCollapse })=> {
  // global store
  const { useAppSelector } = useRedux();
  const [isCollapsed, setIsCollapsed] = useState(false);
  // const { activeTab } = useAppSelector(state => ({
  //   activeTab: state.Layout.activeTab,
  // }));
  const errorData = createSelector(
    (state : any) => state.Layout,
    (state) => ({
      activeTab: state.activeTab,
    })
  );
  // Inside your component
  const { activeTab} = useAppSelector(errorData);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    onToggleCollapse();
  };

  return (
    <>
      <div className={`chat-leftsidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        onClick={handleCollapse} 
        className="collapse-button"
        title={isCollapsed ? "Expandir" : "Contraer"}
      >
        <i className={`bx ${isCollapsed ? 'bx-chevron-right' : 'bx-chevron-left'}`}></i>
      </button>

        <TabContent activeTab={activeTab}>
          {/* Start Profile tab-pane */}
          <TabPane
            tabId={TABS.USERS}
            role="tabpanel"
          >
            <Profile />
          </TabPane>

          <TabPane
            tabId={TABS.ATENCION}
            role="tabpanel"
          >
            <Atencion />
          </TabPane>

          <TabPane
            tabId={TABS.CONTACTS}
            role="tabpanel"
          >
            <Contacts />
          </TabPane>

          <TabPane
            tabId={TABS.CALLS}
            role="tabpanel"
          >
            <Calls />
          </TabPane>

          <TabPane
            tabId={TABS.BOOKMARK}
            role="tabpanel"
          >
            <Bookmark />
          </TabPane>

          <TabPane
            tabId={TABS.SETTINGS}
            role="tabpanel"
          >
            <Settings />
          </TabPane>
        </TabContent>
      </div>
    </>
  );
};

export default Leftbar;
