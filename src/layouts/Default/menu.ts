// costants
import { TABS } from "../../constants/index";

export interface MenuItemType {
  id: number;
  key: string;
  icon: string;
  tooltipTitle: string;
  className?: string;
  tabId:
  | TABS.ADMINISTRACION
  | TABS.ATENCION
  | TABS.METRICS
  | TABS.SETTINGS
  | TABS.USERS
  | TABS.ATENCION;
}
const MENU_ITEMS: MenuItemType[] = [
  {
    id: 1,
    key: "pills-user-tab",
    icon: "bx bx-user-circle",
    tooltipTitle: "Profile",
    className: "d-none d-lg-block",
    tabId: TABS.USERS,
  },
  {
    id: 2,
    key: "pills-chat-tab",
    icon: "bx bx-support",
    tooltipTitle: "Atención",
    tabId: TABS.ATENCION,
  },
  {
    id: 3,
    key: "pills-metrics-tab",
    icon: "bx bx-bar-chart-alt-2",
    tooltipTitle: "Métricas",
    tabId: TABS.METRICS,
  },
  {
    id: 4,
    key: "pills-administracion-tab",
    icon: "bx bx-clipboard",
    tooltipTitle: "Administración",
    tabId: TABS.ADMINISTRACION,
  },
  {
    id: 5,
    key: "pills-setting-tab",
    icon: "bx bx-cog",
    tooltipTitle: "Settings",
    tabId: TABS.SETTINGS,
  },
];

export { MENU_ITEMS };
