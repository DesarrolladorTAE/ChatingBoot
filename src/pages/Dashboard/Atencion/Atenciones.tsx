import React, { useState, useEffect, useCallback, useRef } from "react";
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
import AppSimpleBar from "../../../components/AppSimpleBar";
import Loader from "../../../components/Loader";
import Message from "../ConversationUser/Message";
import { Link } from "react-router-dom";

// ✅ Tipado
interface MessageMeta {
  sent: boolean;
  received: boolean;
  read: boolean;
  isForwarded?: boolean;
  sender: string;
  receiver: string;
  userData?: {
    id: number;
    email: string;
    location: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}


interface MessageType {
  mId: number;
  text: string;
  time: string; // 👈 no Date ni string | Date
  isFromMe: boolean;
  meta: MessageMeta;
  image?: any[];
  attachments?: any[];
  replyOf?: any;
}

interface Ticket {
  id: number;
  name: string;
  lastMessage: string;
  messages: MessageType[];
  profileImage?: string;
  firstName: string;
  lastName: string;
}

const sampleTickets: Ticket[] = [
  {
    id: 1,
    name: "Cliente A",
    firstName: "Cliente",
    lastName: "A",
    lastMessage: "Hola, necesito información.",
    profileImage: "/ruta/a/imagen-predeterminada.png",
    messages: [
      {
        mId: 101,
        time: new Date().toISOString(),
        text: "Hola, ¿en qué puedo ayudarte?",
        isFromMe: false,
        meta: {
          sent: true,
          received: true,
          read: true,
          sender: "cliente_1",
          receiver: "soporte_1",
          userData: {
            id: 999,
            email: "cliente1@correo.com",
            location: "CDMX",
            firstName: "Cliente",
            lastName: "Uno",
            profileImage: "/ruta/a/imagen.png",
          },
        }
        
      },
      {
        mId: 102,
        time: new Date().toISOString(),
        text: "Necesito información sobre el producto X.",
        isFromMe: true,
        meta: {
          sent: true,
          received: true,
          read: true,
          sender: "cliente_1",
          receiver: "soporte_1",
          userData: {
            id: 999,
            email: "cliente1@correo.com",
            location: "CDMX",
            firstName: "Cliente",
            lastName: "Uno",
            profileImage: "/ruta/a/imagen.png",
          },
        }
        
      },
    ],
  },
  {
    id: 2,
    name: "Cliente B",
    firstName: "Cliente",
    lastName: "B",
    lastMessage: "Gracias por la ayuda.",
    profileImage: "/ruta/a/imagen-predeterminada.png",
    messages: [
      {
        mId: 201,
        time: new Date().toISOString(),
        text: "¿Puedo ayudarte en algo más?",
        isFromMe: false,
        meta: {
          sent: true,
          received: true,
          read: false,
          sender: "cliente_b",
          receiver: "soporte_bot",
          userData: {
            id: 998,
            email: "cliente2@correo.com",
            location: "Monterrey",
            firstName: "Cliente",
            lastName: "B",
            profileImage: "/ruta/a/imagen-predeterminada.png",
          },
        },
      },
      {
        mId: 202,
        time: new Date().toISOString(),
        text: "No, muchas gracias.",
        isFromMe: true,
        meta: {
          sent: true,
          received: true,
          read: false,
          sender: "soporte_bot",
          receiver: "cliente_b",
          userData: {
            id: 998,
            email: "cliente2@correo.com",
            location: "Monterrey",
            firstName: "Cliente",
            lastName: "B",
            profileImage: "/ruta/a/imagen-predeterminada.png",
          },
        },
      },
    ],
  },
];


const Atenciones: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"abiertos" | "resultados" | "buscar">("abiertos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const scrollRef = useRef<any>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const listEle = document.getElementById("chat-conversation-list");
      const offsetHeight = listEle?.scrollHeight || 0;
      scrollRef.current.getScrollElement().scrollTo({
        top: offsetHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    if (selectedTicket && selectedTicket.messages.length > 0) {
      scrollToBottom();
    }
  }, [selectedTicket, scrollToBottom]);

  const filteredTickets = sampleTickets.filter((ticket) =>
    ticket.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setSelectedTicket(null);
  };

  return (
    <div className="d-flex" style={{ height: "100%" }}>
      {/* Lado izquierdo */}
      <div className="border-end" style={{ width: "320px" }}>
        <Nav tabs className="bg-light">
          <NavItem>
            <NavLink className={classnames({ active: activeTab === "abiertos" })} onClick={() => toggleTab("abiertos")}>
              Abiertos
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: activeTab === "resultados" })} onClick={() => toggleTab("resultados")}>
              Resultados
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: activeTab === "buscar" })} onClick={() => toggleTab("buscar")}>
              Buscar
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="abiertos">
            <div className="p-2">
              <Input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </TabPane>
          <TabPane tabId="resultados">
            <div className="p-2">
              <p className="text-muted">Resultados filtrados</p>
            </div>
          </TabPane>
          <TabPane tabId="buscar">
            <div className="p-2">
              <Input type="text" placeholder="Buscar tickets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
            <div className="p-3 text-center text-muted">No se encontraron tickets.</div>
          )}
        </div>
      </div>

      {/* Lado derecho */}
      <div className="flex-grow-1 d-flex flex-column">
        {selectedTicket ? (
          <AppSimpleBar scrollRef={scrollRef} className="chat-conversation p-3 p-lg-4 position-relative">
            <Loader /> {/* Mostrar loader si estás cargando datos reales */}
            <ul className="list-unstyled chat-conversation-list" id="chat-conversation-list">
              {selectedTicket.messages.map((msg, key) => (
                <Message
                  key={key}
                  message={msg}
                  chatUserDetails={selectedTicket}
                  onDelete={(id) => console.log("Eliminar mensaje", id)}
                  onSetReplyData={(reply) => console.log("Reply:", reply)}
                  isFromMe={msg.isFromMe}
                  onOpenForward={(msg) => console.log("Forward:", msg)}
                  isChannel={false}
                  onDeleteImage={(messageId, imageId) => console.log("Eliminar imagen", messageId, imageId)}
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
