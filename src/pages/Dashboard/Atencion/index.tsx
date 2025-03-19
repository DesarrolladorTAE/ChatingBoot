import React from "react";
import { Link } from "react-router-dom";
import AppSimpleBar from "../../../components/AppSimpleBar";
import { useRedux } from "../../../hooks/index";

// Importa la acción de atención
import { setSelectedSection } from "../../../redux/atencion/actions";

// Opcional: si necesitas renderizar contenido interno según la subsección, importa sus componentes
// import Atenciones from "./Atenciones";
// import RespuestasRapidas from "./RespuestasRapidas";

interface SectionProps {
  icon: string;
  title: string;
  count?: number;
}

const Atencion: React.FC = () => {
  const { dispatch, useAppSelector } = useRedux();

  // Se lee la subsección activa desde Redux (usando el reducer de atencion)
  // Se usa "atenciones" como valor por defecto si es null
  const selectedSection = useAppSelector(
    (state: any) => state.Atencion.selectedSection
  ) || "atenciones";

  // Lista de subsecciones disponibles
  const predefinedSections: SectionProps[] = [
    { icon: "bx-message-rounded-dots", title: "Atenciones", count: 5 },
    { icon: "bxs-bolt", title: "Respuestas Rapidas" },
    { icon: "bx-filter", title: "Embudo de Ventas", count: 2 },
    { icon: "bx-task", title: "Mis tareas", count: 3 },
    { icon: "bx-user", title: "Contactos" },
    { icon: "bx-calendar-plus", title: "Agendamientos" },
    { icon: "bx-tag", title: "Etiquetas" },
    { icon: "bx-chat", title: "Chat en Equipo" },
  ];

  // Al hacer clic, se despacha la acción para actualizar la subsección activa en Redux
  const handleSectionClick = (sectionTitle: string) => {
    dispatch(setSelectedSection(sectionTitle.toLowerCase()));
  };

  // Componente para cada ítem del menú de subsecciones
  const SectionItem = ({ icon, title, count }: SectionProps) => {
    const isActive = selectedSection === title.toLowerCase();
    return (
      <li className="section-item">
        <Link
          to="#"
          className={`d-flex align-items-center px-3 py-2 ${
            isActive ? "active bg-light" : ""
          }`}
          onClick={() => handleSectionClick(title)}
        >
          <div className="avatar-xs">
            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
              <i className={`bx ${icon}`}></i>
            </span>
          </div>
          <div className="flex-grow-1 ms-2">
            <h5 className="font-size-14 mb-0 section-title">{title}</h5>
          </div>
          {count !== undefined && (
            <div className="flex-shrink-0">
              <span className="badge badge-soft-dark rounded px-1">
                {count}
              </span>
            </div>
          )}
        </Link>
      </li>
    );
  };

  return (
    <div>
      <div className="px-4 pt-4">
        <div className="d-flex align-items-start">
          <div className="flex-grow-1">
            <h4 className="mb-4">Atención</h4>
          </div>
        </div>
      </div>
      <AppSimpleBar className="section-list">
        <ul className="list-unstyled section-list-unstyled mb-0">
          {predefinedSections.map((section, index) => (
            <SectionItem
              key={index}
              icon={section.icon}
              title={section.title}
              count={section.count}
            />
          ))}
        </ul>
      </AppSimpleBar>
      {/* Opcional: si quieres renderizar el contenido interno según la subsección, podrías hacerlo aquí. */}
      {/*
      {selectedSection === "atenciones" && <Atenciones />}
      {selectedSection === "respuestas rapidas" && <RespuestasRapidas />}
      */}
    </div>
  );
};

export default Atencion;
