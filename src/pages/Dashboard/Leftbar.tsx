import React, { useState, useEffect } from "react";
import { TabContent, TabPane } from "reactstrap";

// hooks
import { useRedux } from "../../hooks/index";
import { createSelector } from "reselect";
// constants
import { TABS } from "../../constants/index";

// component
import Profile from "./Profile/index";
import Bookmark from "./Bookmark/index";
import Settings from "./Settings/index";
import Metricas from "./Metricas/index";
import Atencion from "./Atencion/index";
import Administracion from "./Administracion/index";
//Atencion
import Atenciones from "./Atencion/Atenciones";

interface LeftbarProps {
  onToggleCollapse: () => void; // Prop para manejar el colapso
  onSectionChange?: (section: string | null) => void;
}

const Leftbar: React.FC<LeftbarProps> = ({
  onToggleCollapse,
  onSectionChange,
}) => {
  // global store
  const { useAppSelector } = useRedux();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const selectActiveTab = createSelector(
    (state: any) => state.Layout.activeTab,
    (activeTab) => activeTab
  );

  const activeTab = useAppSelector((state: any) => state.Layout.activeTab);


  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    onToggleCollapse();
  };

  // Función para manejar el cambio de pestaña, si la necesitas usar
  // const handleTabChange = (tab: string, subsection?: string) => {
  //   console.log("Leftbar: handleTabChange llamado con tab:", tab, "subsection:", subsection);
  //   if (onSectionChange) {
  //     if (tab === TABS.ATENCION) {
  //       // Si se especifica una subsección, la usamos; de lo contrario, asignamos por defecto "Atenciones"
  //       const sub = subsection ? subsection : "atenciones";
  //       console.log("Leftbar: Tab es ATENCION. Llamando onSectionChange con:", sub);
  //       onSectionChange(sub);
  //     } else {
  //       console.log("Leftbar: Tab no es ATENCION. Llamando onSectionChange con null");
  //       onSectionChange(null);
  //     }
  //   } else {
  //     console.log("Leftbar: onSectionChange es undefined");
  //   }
  // };
  

  // Usamos un useEffect para detectar cambios en activeTab y ejecutar la función
  // useEffect(() => {
  //   handleTabChange(activeTab);
  // }, [activeTab]);

  return (
    <div className={`chat-leftsidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button
        onClick={handleCollapse}
        className="collapse-button"
        title={isCollapsed ? "Expandir" : "Contraer"}
      >
        <i
          className={`bx ${isCollapsed ? "bx-chevron-right" : "bx-chevron-left"}`}
        ></i>
      </button>

      <TabContent activeTab={activeTab}>
        <TabPane tabId={TABS.USERS} role="tabpanel">
          <Profile />
        </TabPane>

        <TabPane tabId={TABS.ATENCION} role="tabpanel">
          <Atencion />
        </TabPane>

        <TabPane tabId={TABS.METRICS} role="tabpanel">
          <Metricas />
        </TabPane>

        <TabPane tabId={TABS.ADMINISTRACION} role="tabpanel">
          <Administracion />
        </TabPane>

        <TabPane tabId={TABS.SETTINGS} role="tabpanel">
          <Settings />
        </TabPane>
      </TabContent>
    </div>
  );
};

export default Leftbar;
