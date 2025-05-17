import React, { useState, useEffect } from "react";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  CardBody,
  Input,
} from "reactstrap";
import classnames from "classnames";
import { useProfile, useRedux } from "../../../hooks";
import ConversationWithRedux from "./ConversationWithRedux";
import { ChatsActionTypes } from "../../../redux/chats/types";
import {
  getChatUserConversations,
  getDirectMessages,
} from "../../../redux/chats/actions";

const sampleTickets = [
  {
    id: 1,
    name: "Cliente A",
    lastMessage: "Hola, necesito información.",
  },
  {
    id: 2,
    name: "Cliente B",
    lastMessage: "Gracias por la ayuda.",
  },
];

type ConversationTicket = {
  id: number;
  contact: {
    id: number;
    first_name: string;
    last_name?: string;
    phone: string;
    profile_image?: string;
  };
  agent?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
  [key: string]: any; // opcional para permitir otros campos
};

const Atenciones: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "abiertos" | "resultados" | "buscar"
  >("abiertos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] =
    useState<ConversationTicket | null>(null);
  const { dispatch } = useRedux();
  const { userProfile } = useProfile();
  const { useAppSelector } = useRedux();

  const tickets = useAppSelector(state =>
    Array.isArray(state.Chats.conversations) ? state.Chats.conversations : [],
  );

  console.log("🎫 Tickets en Atenciones:", tickets);

  const filteredTickets = (tickets || []).filter(
    (ticket: ConversationTicket) =>
      !!ticket && !!ticket.id && ticket.contact && ticket.contact.first_name,
  );

  console.log("🟡 filteredTickets:", filteredTickets);

  const toggleTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setSelectedTicket(null);
  };

  const handleSelectTicket = (ticket: ConversationTicket) => {
    console.log("🏷️ Ticket seleccionado:", ticket);
    if (!ticket || !ticket.id) {
      console.error("🚨 Intento de seleccionar ticket inválido", ticket);
      return;
    }
    setSelectedTicket(ticket);
    dispatch(getDirectMessages({ id: ticket.id, contact: ticket.contact }));
  };

  useEffect(() => {
    dispatch(getChatUserConversations());
  }, [dispatch]);

  return (
    <div className="d-flex" style={{ height: "100%" }}>
      {/* Lado izquierdo */}
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
                onChange={e => setSearchTerm(e.target.value)}
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
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </TabPane>
        </TabContent>

        <div style={{ height: "calc(100% - 150px)", overflowY: "auto" }}>
          {Array.isArray(filteredTickets) &&
          filteredTickets.filter(t => t && t.id).length > 0 ? (
            filteredTickets
              .filter(ticket => !!ticket && !!ticket.id) // 🛡️ Solo válidos
              .map((ticket: ConversationTicket) => (
                <Card
                  key={ticket.id}
                  className="m-2"
                  onClick={() => handleSelectTicket(ticket)}
                  style={{ cursor: "pointer" }}
                >
                  <CardBody>
                    <strong>
                      {ticket.contact?.first_name ?? "Sin nombre"}
                    </strong>
                    <div className="small text-muted">
                      Última actualización:{" "}
                      {ticket.updated_at
                        ? new Date(ticket.updated_at).toLocaleString()
                        : "Sin fecha"}
                    </div>
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

      {/* Lado derecho */}
      <div className="flex-grow-1 d-flex flex-column">
        {selectedTicket ? (
          <ConversationWithRedux selectedTicket={selectedTicket} />
        ) : (
          <div className="d-flex justify-content-center align-items-center h-100">
            <h2 className="text-muted">
              Selecciona un ticket para ver la conversación
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Atenciones;
