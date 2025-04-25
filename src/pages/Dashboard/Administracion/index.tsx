import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppSimpleBar from "../../../components/AppSimpleBar";
import { useRedux } from "../../../hooks/index";

// Redux para cambio de sección
import { setSelectedSection } from "../../../redux/atencion/actions";

interface SectionProps {
  icon: string;
  title: string;
  count?: number;
  isActive?: boolean;
  hasSubsections?: boolean;
  expanded?: boolean;
  subsections?: Array<SubsectionProps>;
}

interface SubsectionProps {
  title: string;
  isActive?: boolean;
}

const Administracion = () => {
  const { dispatch } = useRedux();

  const [activeSection, setActiveSection] = useState<string>("campañas");
  const [activeSubsection, setActiveSubsection] = useState<string>("lista de campañas");

  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    campañas: true
  });

  const predefinedSections: SectionProps[] = [
    {
      icon: "bx-calendar",
      title: "Campañas",
      hasSubsections: true,
      subsections: [
        { title: "Lista de campañas" },
        { title: "Listas de Contacto" },
        { title: "Configuración de Campañas" }
      ]
    },
    { icon: "bx-plug", title: "Conexiones", count: 1 },
    { icon: "bx-file", title: "Lista de archivos" },
    { icon: "bx-chat", title: "Area & Chatbot" },
    { icon: "bx-group", title: "Equipo" },
    { icon: "bx-code", title: "API" },
    { icon: "bx-dollar", title: "Facturacion" },
  ];

  const handleSectionClick = (sectionTitle: string, hasSubsections = false) => {
    const lower = sectionTitle.toLowerCase();

    if (hasSubsections) {
      setExpandedSections(prev => ({
        ...prev,
        [lower]: !prev[lower]
      }));
    } else {
      setActiveSection(lower);
      dispatch(setSelectedSection(lower)); // 💥 Activa en Redux
    }
  };

  const handleSubsectionClick = (sectionTitle: string, subsectionTitle: string) => {
    const lowerSub = subsectionTitle.toLowerCase();
    setActiveSection(sectionTitle.toLowerCase());
    setActiveSubsection(lowerSub);
    dispatch(setSelectedSection(lowerSub)); // 💥 Dispara subsección si aplica
  };

  const SubsectionItem = ({ title, isActive }: SubsectionProps) => {
    return (
      <li className="subsection-item ps-4">
        <Link
          to="#"
          className={`d-flex align-items-center px-3 py-2 ${isActive ? "active bg-light" : ""}`}
          onClick={() => handleSubsectionClick("campañas", title)}
        >
          <div className="flex-grow-1 ms-2">
            <h5 className="font-size-14 mb-0 subsection-title">{title}</h5>
          </div>
        </Link>
      </li>
    );
  };

  const SectionItem = ({ icon, title, count, isActive, hasSubsections, subsections }: SectionProps) => {
    const isExpanded = expandedSections[title.toLowerCase()];
    return (
      <>
        <li className="section-item">
          <Link
            to="#"
            className={`d-flex align-items-center px-3 py-2 ${isActive && !hasSubsections ? "active bg-light" : ""}`}
            onClick={() => handleSectionClick(title, hasSubsections)}
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
              <div className="flex-shrink-0 me-2">
                <span className="badge badge-soft-danger rounded px-1">{count}</span>
              </div>
            )}
            {hasSubsections && (
              <div className="flex-shrink-0">
                <i className={`bx ${isExpanded ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
              </div>
            )}
          </Link>
        </li>
        {hasSubsections && isExpanded && subsections && (
          <ul className="list-unstyled section-subsections mb-0">
            {subsections.map((sub, i) => (
              <SubsectionItem
                key={i}
                title={sub.title}
                isActive={activeSection === title.toLowerCase() && activeSubsection === sub.title.toLowerCase()}
              />
            ))}
          </ul>
        )}
      </>
    );
  };

  return (
    <div>
      <div className="px-4 pt-4">
        <div className="d-flex align-items-start">
          <div className="flex-grow-1">
            <h4 className="mb-4">Administración</h4>
          </div>
        </div>
      </div>
      <AppSimpleBar className="section-list">
        <ul className="list-unstyled section-list-unstyled mb-0">
          {predefinedSections.map((section, i) => (
            <SectionItem
              key={i}
              icon={section.icon}
              title={section.title}
              count={section.count}
              isActive={activeSection === section.title.toLowerCase()}
              hasSubsections={section.hasSubsections}
              subsections={section.subsections}
            />
          ))}
        </ul>
      </AppSimpleBar>
    </div>
  );
};

export default Administracion;
