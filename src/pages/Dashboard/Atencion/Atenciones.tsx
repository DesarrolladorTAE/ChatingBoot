import React, { useState } from "react";
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
import { useEffect } from "react";
import { ChatsActionTypes } from "../../../redux/chats/types";

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

const Atenciones: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "abiertos" | "resultados" | "buscar"
  >("abiertos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const { dispatch } = useRedux();
  const { userProfile } = useProfile();

  const filteredTickets = sampleTickets.filter(ticket =>
    ticket.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setSelectedTicket(null);
  };

  useEffect(() => {
    if (selectedTicket) {
      dispatch({
        type: ChatsActionTypes.API_RESPONSE_SUCCESS,
        payload: {
          actionType: ChatsActionTypes.GET_CHAT_USER_CONVERSATIONS,
          data: [
            {
              mId: 101,
              text: "Hola desde Redux!",
              time: new Date().toISOString(),
              isFromMe: false,
              meta: {
                sent: true,
                received: true,
                read: true,
                sender: "cliente",
                receiver: "agente",
              },
            },
          ],
        },
      });

      dispatch({
        type: ChatsActionTypes.API_RESPONSE_SUCCESS,
        payload: {
          actionType: ChatsActionTypes.GET_CHAT_USER_DETAILS,
          data: selectedTicket,
        },
      });
    }
  }, [selectedTicket, dispatch]);

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
          {filteredTickets.length > 0 ? (
            filteredTickets.map(ticket => (
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
