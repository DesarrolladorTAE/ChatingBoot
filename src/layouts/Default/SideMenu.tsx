import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import {
  Nav,
  NavItem,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  NavLink,
  UncontrolledTooltip,
} from "reactstrap";
import { createSelector } from "reselect";
// hooks
import { useRedux } from "../../hooks/index";

// actions
import { changeTab } from "../../redux/actions";

// costants
import { TABS } from "../../constants/index";
import LightDarkMode from "../../components/LightDarkMode";

//images
import avatar1 from "../../assets/images/users/avatar-1.jpg";

// menu
import { MENU_ITEMS, MenuItemType } from "./menu";

const LogoLightSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
    >
      <path d="M8.5,18l3.5,4l3.5-4H19c1.103,0,2-0.897,2-2V4c0-1.103-0.897-2-2-2H5C3.897,2,3,2.897,3,4v12c0,1.103,0.897,2,2,2H8.5z M7,7h10v2H7V7z M7,11h7v2H7V11z" />
    </svg>
  );
};

const LogoDarkSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
    >
      <path d="M8.5,18l3.5,4l3.5-4H19c1.103,0,2-0.897,2-2V4c0-1.103-0.897-2-2-2H5C3.897,2,3,2.897,3,4v12c0,1.103,0.897,2,2,2H8.5z M7,7h10v2H7V7z M7,11h7v2H7V11z" />
    </svg>
  );
};

const Logo = () => {
  return (
    <div className="navbar-brand-box">
  <Link to="#" className="logo logo-dark" title="Chattingbot">
    <span className="logo-sm">
      <i className="fa-solid fa-robot fa-2x text-primary"></i>
    </span>
  </Link>
  {/* Opcional: Si también quieres el logo en su versión "light", puedes hacer algo similar */}
  <Link to="#" className="logo logo-light">
    <span className="logo-sm">
      <i className="fa-solid fa-robot fa-2x text-primary"></i>
    </span>
  </Link>
</div>

  );
};

interface MenuNavItemProps {
  item: MenuItemType;
  selectedTab:
    | TABS.ADMINISTRACION
    | TABS.ATENCION
    | TABS.METRICS
    | TABS.SETTINGS
    | TABS.USERS;
  onChangeTab: (
    id:
      | TABS.ADMINISTRACION
      | TABS.ATENCION
      | TABS.METRICS
      | TABS.SETTINGS
      | TABS.USERS,
  ) => void;
}
const MenuNavItem = ({ item, selectedTab, onChangeTab }: MenuNavItemProps) => {
  const onClick = () => {
    onChangeTab(item.tabId);
  };
  return (
    <>
      <NavItem className={item.className} id={`${item.key}-container`}>
        <NavLink
          href="#"
          active={selectedTab === item.tabId}
          id={item.key}
          role="tab"
          onClick={onClick}
        >
          <i className={item.icon}></i>
        </NavLink>
      </NavItem>
      <UncontrolledTooltip target={`${item.key}-container`} placement="right">
        {item.tooltipTitle}
      </UncontrolledTooltip>
    </>
  );
};

interface ProfileDropdownMenuProps {
  onChangeTab: (
    id:
      | TABS.ADMINISTRACION
      | TABS.ATENCION
      | TABS.METRICS
      | TABS.SETTINGS
      | TABS.USERS,
  ) => void;
}
const ProfileDropdownMenu = ({ onChangeTab }: ProfileDropdownMenuProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <Dropdown
      nav
      isOpen={dropdownOpen}
      className="profile-user-dropdown"
      toggle={toggle}
    >
      <DropdownToggle nav className="bg-transparent">
        <img src={avatar1} alt="" className="profile-user rounded-circle" />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          onClick={() => onChangeTab(TABS.USERS)}
        >
          Perfil <i className="bx bx-user-circle text-muted ms-1"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          onClick={() => onChangeTab(TABS.SETTINGS)}
        >
          Configuración <i className="bx bx-cog text-muted ms-1"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          href="/auth-changepassword"
        >
          Cambiar contraseña <i className="bx bx-lock-open text-muted ms-1"></i>
        </DropdownItem>

        <DropdownItem />
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          tag={Link}
          to="/logout"
          // tag="a"
          // href="/logout"
        >
          Cerrar sesión <i className="bx bx-log-out-circle text-muted ms-1"></i>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const SideMenu = ({ onChangeLayoutMode }: any) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();

  const menuItems: MenuItemType[] = MENU_ITEMS;
  // const { activeTab, layoutMode } = useAppSelector(state => ({
  //   activeTab: state.Layout.activeTab,
  //   layoutMode: state.Layout.layoutMode,
  // }));

  const errorData = createSelector(
    (state: any) => state.Layout,
    state => ({
      activeTab: state.activeTab,
      layoutMode: state.layoutMode,
    }),
  );
  // Inside your component
  const { activeTab, layoutMode } = useAppSelector(errorData);

  /* 
    tab activation
    */
  const [selectedTab, setSelectedTab] = useState<
    | TABS.ADMINISTRACION
    | TABS.ATENCION
    | TABS.METRICS
    | TABS.SETTINGS
    | TABS.USERS
  >(TABS.ATENCION);
  const onChangeTab = (
    id:
      | TABS.ADMINISTRACION
      | TABS.ATENCION
      | TABS.METRICS
      | TABS.SETTINGS
      | TABS.USERS,
  ) => {
    setSelectedTab(id);
    dispatch(changeTab(id));
  };

  useEffect(() => {
    setSelectedTab(activeTab);
  }, [activeTab]);

  return (
    <div className="side-menu flex-lg-column">
      {/* LOGO */}
      <Logo />
      {/* end navbar-brand-box */}

      {/* Start side-menu nav */}
      <div className="flex-lg-column my-0 sidemenu-navigation">
        <Nav pills className="side-menu-nav" role="tablist">
          {(menuItems || []).map((item: MenuItemType, key: number) => (
            <MenuNavItem
              item={item}
              key={key}
              selectedTab={selectedTab}
              onChangeTab={onChangeTab}
            />
          ))}

          {/* change mode */}
          <LightDarkMode
            layoutMode={layoutMode}
            onChangeLayoutMode={onChangeLayoutMode}
          />

          {/* profile menu dropdown */}
          <ProfileDropdownMenu onChangeTab={onChangeTab} />
        </Nav>
      </div>
      {/* end side-menu nav */}
    </div>
  );
};

export default SideMenu;
