import React, { useState } from "react";
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import classnames from "classnames";

// Interfaz para un item de la lista de atenciones
interface AttentionItem {
  id: number;
  name: string;
  lastMessage: string;
  labels: string[]; // etiquetas (conexión, usuario, área, personalizadas, etc.)
  status: "EN ESPERA" | "ATENDIENDO" | "FINALIZADA"; // o el que manejes
  time: string; // hora/fecha ficticia
}

const Atenciones = () => {
  // Estado para las tabs (Abiertos, Resueltos, Buscar)
  const [activeTab, setActiveTab] = useState<"abiertos" | "resueltos" | "buscar">("abiertos");

  // Dropdowns para “Todos”, “Área & Sectores”
  const [openTodosDropdown, setOpenTodosDropdown] = useState(false);
  const [openAreaDropdown, setOpenAreaDropdown] = useState(false);

  // Estado para la atención seleccionada
  const [selectedAttention, setSelectedAttention] = useState<AttentionItem | null>(null);

  // Datos ficticios para la lista de atenciones
  const attentionList: AttentionItem[] = [
    {
      id: 1,
      name: "Josías",
      lastMessage: "Adios",
      labels: ["PRUEBA", "TAE", "CHATTING"],
      status: "ATENDIENDO",
      time: "12:50",
    },
    {
      id: 2,
      name: "Gema Ramírez",
      lastMessage: "Hola, necesito ayuda",
      labels: ["PRUEBA", "Juan Pérez", "Soporte", "IMPORTANTE"],
      status: "EN ESPERA",
      time: "13:00",
    },
    {
      id: 3,
      name: "Proyecto Chatbot",
      lastMessage: "Conversación previa",
      labels: ["CHATBOT", "Luis G.", "TI"],
      status: "ATENDIENDO",
      time: "10:25",
    },
    {
      id: 4,
      name: "ResidenciasTAE",
      lastMessage: "Status",
      labels: ["PRUEBA", "Sofía M.", "Ventas", "PENDIENTE"],
      status: "EN ESPERA",
      time: "09:45",
    },
  ];

  // Filtrar la lista de atenciones según la tab activa
  // (Por ahora, solo muestro todo en "abiertos" y nada en "resueltos" o "buscar")
  let filteredAttentions: AttentionItem[] = [];
  if (activeTab === "abiertos") {
    filteredAttentions = attentionList; // Podrías filtrar según status
  } else if (activeTab === "resueltos") {
    // Ejemplo: filtrar por finalizadas
    filteredAttentions = attentionList.filter((a) => a.status === "FINALIZADA");
  } else {
    // buscar: en este ejemplo no implementamos la lógica, quedaría vacío
    filteredAttentions = [];
  }

  // Funciones para manejar clicks
  const handleSelectAttention = (item: AttentionItem) => {
    setSelectedAttention(item);
  };

  // Renderizado de cada item en la lista de atenciones
  const renderAttentionItem = (item: AttentionItem) => {
    return (
      <div
        key={item.id}
        className={classnames("p-2 attention-item", {
          active: selectedAttention?.id === item.id,
        })}
        onClick={() => handleSelectAttention(item)}
        style={{ cursor: "pointer" }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h6 className="mb-0">{item.name}</h6>
            <small className="text-muted">{item.lastMessage}</small>
          </div>
          <small>{item.time}</small>
        </div>
        <div className="mt-1">
          {/* Render de etiquetas en orden (conexión, usuario, área, personalizadas...) */}
          {item.labels.map((label, idx) => (
            <span
              key={idx}
              className="badge bg-primary me-1"
              style={{ fontSize: "0.7rem" }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Render del área derecha (Chat o pantalla vacía con el logo)
  const renderChatArea = () => {
    if (!selectedAttention) {
      return (
        <div className="d-flex flex-column justify-content-center align-items-center h-100">
          <h3 className="text-muted">CHATING BOOT</h3>
          <p className="text-muted">Selecciona una atención para comenzar</p>
        </div>
      );
    }
    // Si hay atención seleccionada, puedes renderizar la conversación
    return (
      <div className="p-3 h-100 d-flex flex-column">
        <div className="mb-2 border-bottom pb-2">
          <h5 className="mb-0">
            {selectedAttention.name} - {selectedAttention.status}
          </h5>
          <small className="text-muted">
            Asignado a: {selectedAttention.labels[1] ?? "Sin Asignar"}
          </small>
        </div>
        <div className="flex-grow-1" style={{ overflowY: "auto" }}>
          {/* Aquí irían los mensajes del chat */}
          <p className="text-muted">[Mensajes de ejemplo]</p>
        </div>
        <div className="mt-2">
          <input
            type="text"
            className="form-control"
            placeholder="Escribe un mensaje..."
          />
        </div>
      </div>
    );
  };

  return (
    <div className="user-chat-container" style={{ height: "100vh", overflow: "hidden" }}>
      <Row className="h-100 g-0">
        {/* Columna Izquierda */}
        <Col md={3} className="border-end d-flex flex-column" style={{ maxWidth: "320px" }}>
          {/* Tabs superiores */}
          <Nav pills className="nav-justified bg-light">
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "abiertos" })}
                onClick={() => setActiveTab("abiertos")}
              >
                Abiertos
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "resueltos" })}
                onClick={() => setActiveTab("resueltos")}
              >
                Resueltos
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "buscar" })}
                onClick={() => setActiveTab("buscar")}
              >
                Buscar
              </NavLink>
            </NavItem>
          </Nav>

          {/* Contenido debajo de las tabs */}
          <div className="flex-grow-1" style={{ overflowY: "auto" }}>
            {/* Controles: NUEVO, Todos, Área & Sectores */}
            <div className="p-3 d-flex align-items-center gap-2">
              <Button color="primary" size="sm">
                NUEVO
              </Button>

              {/* Dropdown: Todos */}
              <Dropdown isOpen={openTodosDropdown} toggle={() => setOpenTodosDropdown(!openTodosDropdown)}>
                <DropdownToggle color="light" size="sm" caret>
                  Todos
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Opción 1</DropdownItem>
                  <DropdownItem>Opción 2</DropdownItem>
                  <DropdownItem>Opción 3</DropdownItem>
                </DropdownMenu>
              </Dropdown>

              {/* Dropdown: Área & Sectores */}
              <Dropdown isOpen={openAreaDropdown} toggle={() => setOpenAreaDropdown(!openAreaDropdown)}>
                <DropdownToggle color="light" size="sm" caret>
                  Área & Sectores
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Área 1</DropdownItem>
                  <DropdownItem>Área 2</DropdownItem>
                  <DropdownItem>Área 3</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            {/* Secciones de estado: EN ESPERA, ATENDIENDO */}
            <div className="px-3 mb-2">
              <small className="text-muted">ESTADOS</small>
              <div className="mt-2">
                <span className="d-block">En Espera</span>
                <span className="d-block">Atendiendo</span>
                {/* Agrega más si deseas */}
              </div>
            </div>

            {/* Lista de atenciones */}
            <div className="px-2">
              {filteredAttentions.length === 0 ? (
                <div className="p-3 text-center text-muted">
                  No se encontró ninguna atención con ese estado
                </div>
              ) : (
                filteredAttentions.map((item) => renderAttentionItem(item))
              )}
            </div>
          </div>
        </Col>

        {/* Columna Derecha (Chat o contenido) */}
        <Col md={9} className="bg-white">
          {renderChatArea()}
        </Col>
      </Row>
    </div>
  );
};

export default Atenciones;
