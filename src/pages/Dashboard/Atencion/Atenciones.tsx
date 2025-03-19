import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Badge,
  Input,
  FormGroup,
  Label,
  Row,
  Col,
} from "reactstrap";
import { useRedux } from "../../../hooks/index";

interface Atencion {
  id: number;
  cliente: string;
  asunto: string;
  fecha: string;
  estado: string;
  prioridad: string;
  ultimoMensaje: string;
}

const Atenciones = () => {
  const [atenciones, setAtenciones] = useState<Atencion[]>([
    {
      id: 1,
      cliente: "Juan Pérez",
      asunto: "Consulta sobre producto",
      fecha: "2025-03-15 10:30",
      estado: "abierto",
      prioridad: "alta",
      ultimoMensaje: "Necesito más información sobre el producto XYZ.",
    },
    {
      id: 2,
      cliente: "María González",
      asunto: "Problema con facturación",
      fecha: "2025-03-17 15:45",
      estado: "en proceso",
      prioridad: "media",
      ultimoMensaje: "No recibí la factura del mes pasado.",
    },
    {
      id: 3,
      cliente: "Carlos Rodríguez",
      asunto: "Solicitud de devolución",
      fecha: "2025-03-18 09:15",
      estado: "abierto",
      prioridad: "baja",
      ultimoMensaje: "Quiero devolver el producto por un defecto.",
    },
    {
      id: 4,
      cliente: "Ana Martínez",
      asunto: "Información sobre envío",
      fecha: "2025-03-18 11:20",
      estado: "abierto",
      prioridad: "alta",
      ultimoMensaje: "¿Cuándo llegará mi pedido?",
    },
    {
      id: 5,
      cliente: "Pedro Sánchez",
      asunto: "Consulta técnica",
      fecha: "2025-03-19 08:30",
      estado: "nuevo",
      prioridad: "media",
      ultimoMensaje: "Tengo problemas para configurar el dispositivo.",
    },
  ]);

  const [filteredAtenciones, setFilteredAtenciones] =
    useState<Atencion[]>(atenciones);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterPrioridad, setFilterPrioridad] = useState("todas");

  useEffect(() => {
    let result = atenciones;

    if (searchTerm) {
      result = result.filter(
        atencion =>
          atencion.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          atencion.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
          atencion.ultimoMensaje
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    if (filterEstado !== "todos") {
      result = result.filter(atencion => atencion.estado === filterEstado);
    }

    if (filterPrioridad !== "todas") {
      result = result.filter(
        atencion => atencion.prioridad === filterPrioridad,
      );
    }

    setFilteredAtenciones(result);
  }, [searchTerm, filterEstado, filterPrioridad, atenciones]);

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "nuevo":
        return "primary";
      case "abierto":
        return "success";
      case "en proceso":
        return "warning";
      case "cerrado":
        return "secondary";
      default:
        return "info";
    }
  };

  const getPrioridadBadgeColor = (prioridad: string) => {
    switch (prioridad) {
      case "alta":
        return "danger";
      case "media":
        return "warning";
      case "baja":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <div className="conversation-content p-4">
      <h4 className="mb-4">Atenciones</h4>

      <div className="mb-4">
        <Row>
          <Col md={4}>
            <Input
              type="text"
              placeholder="Buscar por cliente, asunto o mensaje..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="mb-3"
            />
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="estadoFilter">Estado</Label>
              <Input
                type="select"
                id="estadoFilter"
                value={filterEstado}
                onChange={e => setFilterEstado(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="nuevo">Nuevo</option>
                <option value="abierto">Abierto</option>
                <option value="en proceso">En proceso</option>
                <option value="cerrado">Cerrado</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="prioridadFilter">Prioridad</Label>
              <Input
                type="select"
                id="prioridadFilter"
                value={filterPrioridad}
                onChange={e => setFilterPrioridad(e.target.value)}
              >
                <option value="todas">Todas</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>
      </div>

      <div
        className="atenciones-list"
        style={{ maxHeight: "600px", overflowY: "auto" }}
      >
        {filteredAtenciones.length > 0 ? (
          filteredAtenciones.map(atencion => (
            <Card
              key={atencion.id}
              className="mb-3 cursor-pointer hover-shadow"
            >
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0">{atencion.cliente}</h5>
                  <div>
                    <Badge
                      color={getEstadoBadgeColor(atencion.estado)}
                      className="me-2"
                    >
                      {atencion.estado.toUpperCase()}
                    </Badge>
                    <Badge color={getPrioridadBadgeColor(atencion.prioridad)}>
                      {atencion.prioridad.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <h6>{atencion.asunto}</h6>
                <p className="text-muted mb-2">{atencion.ultimoMensaje}</p>
                <small className="text-muted">{atencion.fecha}</small>
                <div className="d-flex justify-content-end mt-2">
                  <Button color="primary" size="sm">
                    Ver detalles
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <div className="text-center p-4">
            <p className="text-muted">
              No se encontraron atenciones con los filtros aplicados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Atenciones;
