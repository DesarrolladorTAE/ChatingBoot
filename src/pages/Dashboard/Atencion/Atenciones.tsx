import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  CardBody,
  Button,
  Badge,
  Input,
  Row,
  Col,
} from "reactstrap";
import classnames from "classnames";
import AppSimpleBar from "../../../components/AppSimpleBar";
import Loader from "../../../components/Loader";
import Message from "../ConversationUser/Message"; // Componente de mensaje con toda la lógica de imágenes, menú, etc.
import { Link } from "react-router-dom";

// Simulación de datos para tickets y mensajes
interface Ticket {
  id: number;
  name: string;
  lastMessage: string;
  messages: any[]; // Aquí colocarías el tipo correcto de tus mensajes
}

const sampleTickets: Ticket[] = [
  {
    id: 1,
    name: "Cliente A",
    lastMessage: "Hola, necesito información.",
    messages: [
      { mId: 101, time: new Date(), text: "Hola, ¿en qué puedo ayudarte?", isFromMe: false, meta: { sent: true, received: true, read: true } },
      { mId: 102, time: new Date(), text: "Necesito información sobre el producto X.", isFromMe: true, meta: { sent: true, received: true, read: true } },
    ],
  },
  {
    id: 2,
    name: "Cliente B",
    lastMessage: "Gracias por la ayuda.",
    messages: [
      { mId: 201, time: new Date(), text: "¿Puedo ayudarte en algo más?", isFromMe: false, meta: { sent: true, received: true, read: false } },
      { mId: 202, time: new Date(), text: "No, muchas gracias.", isFromMe: true, meta: { sent: true, received: true, read: false } },
    ],
  },
];

const Atenciones: React.FC = () => {
  // Estados para la barra lateral y pestañas
  const [activeTab, setActiveTab] = useState<"abiertos" | "resultados" | "buscar">("abiertos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Para la parte de conversación (mensajes)
  const messages = selectedTicket?.messages || [];

  // Referencia para controlar el scroll en la conversación
  const scrollRef = useRef<any>(null);
  const scrollElement = useCallback(() => {
    if (scrollRef && scrollRef.current) {
      const listEle = document.getElementById("chat-conversation-list");
      let offsetHeight = 0;
      if (listEle) {
        offsetHeight = listEle.scrollHeight - window.innerHeight + 250;
      }
      if (offsetHeight) {
        scrollRef.current
          .getScrollElement()
          .scrollTo({ top: offsetHeight, behavior: "smooth" });
      }
    }
  }, [scrollRef]);

  useEffect(() => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.recalculate();
    }
  }, []);

  useEffect(() => {
    if (selectedTicket && selectedTicket.messages) {
      scrollElement();
    }
  }, [selectedTicket?.messages, scrollElement]);

  // Filtrado de tickets basado en la pestaña activa y el término de búsqueda
  const filteredTickets = sampleTickets.filter((ticket) => {
    const matchesSearch = ticket.name.toLowerCase().includes(searchTerm.toLowerCase());
    // Aquí podrías agregar lógica adicional según el valor de activeTab (por ejemplo, filtrar "Abiertos" o "Resultados")
    return matchesSearch;
  });

  const toggleTab = (tab: "abiertos" | "resultados" | "buscar") => {
    setActiveTab(tab);
    // Al cambiar de pestaña, reseteamos el ticket seleccionado
    setSelectedTicket(null);
  };

  return (
    <div className="d-flex" style={{ height: "100%" }}>
      {/* Panel lateral con pestañas y lista de tickets */}
      <div className="border-end" style={{ width: "320px" }}>
        <Nav tabs className="bg-light">
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "abiertos" })}
              onClick={() => toggleTab("abiertos")}
            >
              Abiertos
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "resultados" })}
              onClick={() => toggleTab("resultados")}
            >
              Resultados
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "buscar" })}
              onClick={() => toggleTab("buscar")}
            >
              Buscar
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="abiertos">
            <div className="p-2">
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </TabPane>
          <TabPane tabId="resultados">
            <div className="p-2">
              <p className="text-muted">Resultados filtrados</p>
            </div>
          </TabPane>
          <TabPane tabId="buscar">
            <div className="p-2">
              <Input
                type="text"
                placeholder="Buscar tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </TabPane>
        </TabContent>
        <div style={{ height: "calc(100% - 150px)", overflowY: "auto" }}>
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="m-2"
                onClick={() => setSelectedTicket(ticket)}
                style={{ cursor: "pointer" }}
              >
                <CardBody>
                  <strong>{ticket.name}</strong>
                  <div className="small text-muted">{ticket.lastMessage}</div>
                </CardBody>
              </Card>
            ))
          ) : (
            <div className="p-3 text-center text-muted">
              No se encontraron tickets.
            </div>
          )}
        </div>
      </div>

      {/* Área principal de conversación */}
      <div className="flex-grow-1 d-flex flex-column">
        {selectedTicket ? (
          <AppSimpleBar
            scrollRef={scrollRef}
            className="chat-conversation p-3 p-lg-4 position-relative"
          >
            <Loader /> {/* Puedes condicionar la visualización del loader según el estado de carga */}
            <ul className="list-unstyled chat-conversation-list" id="chat-conversation-list">
              {messages.map((msg, key) => (
                <Message
                  key={key}
                  message={msg}
                  chatUserDetails={selectedTicket}
                  onDelete={(id) => console.log("Eliminar mensaje", id)}
                  onSetReplyData={(reply) => console.log("Establecer reply", reply)}
                  isFromMe={msg.isFromMe}
                  onOpenForward={(msg) => console.log("Reenviar mensaje", msg)}
                  isChannel={false}
                  onDeleteImage={(messageId, imageId) =>
                    console.log("Eliminar imagen", messageId, imageId)
                  }
                />
              ))}
            </ul>
          </AppSimpleBar>
        ) : (
          <div className="d-flex justify-content-center align-items-center h-100">
            <h2 className="text-muted">Selecciona un ticket para ver la conversación</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Atenciones;
