import React, { useState } from "react";
import { Button, Form, Input } from "reactstrap";
import { Link } from "react-router-dom";
// hooks
import { useRedux } from "../../../hooks/index";

// components
import AppSimpleBar from "../../../components/AppSimpleBar";

// interfaces
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

interface IndexProps {}

const Administracion = (props: IndexProps) => {
  // global store
  const { dispatch } = useRedux();

  // Estado para la sección actualmente seleccionada
  const [activeSection, setActiveSection] = useState<string>("campañas");
  const [activeSubsection, setActiveSubsection] = useState<string>("lista de campañas");
  
  // Estado para controlar secciones expandidas
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    campañas: true
  });

  // Lista de secciones predefinidas
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

  const handleSectionClick = (sectionTitle: string, hasSubsections: boolean = false) => {
    // Si la sección tiene subsecciones, solo expandimos/colapsamos
    if (hasSubsections) {
      setExpandedSections(prev => ({
        ...prev,
        [sectionTitle.toLowerCase()]: !prev[sectionTitle.toLowerCase()]
      }));
    } else {
      // Si no tiene subsecciones, la activamos directamente
      setActiveSection(sectionTitle.toLowerCase());
      // Aquí puedes disparar acciones de Redux según la sección seleccionada
      // dispatch(changeSelectedSection(sectionTitle.toLowerCase()));
    }
  };

  const handleSubsectionClick = (sectionTitle: string, subsectionTitle: string) => {
    setActiveSection(sectionTitle.toLowerCase());
    setActiveSubsection(subsectionTitle.toLowerCase());
    // Aquí puedes disparar acciones de Redux según la subsección seleccionada
    // dispatch(changeSelectedSubsection(subsectionTitle.toLowerCase()));
  };

  // const searchSections = () => {
  //   const inputValue: any = document.getElementById("searchSections");
  //   const filter: any = inputValue.value.toUpperCase();
  //   const sectionItems = document.querySelectorAll(".section-item, .subsection-item");
    
  //   sectionItems.forEach((item: any) => {
  //     const titleElement = item.querySelector(".section-title, .subsection-title");
  //     if (titleElement) {
  //       const txtValue = titleElement.textContent || titleElement.innerText;
  //       if (txtValue.toUpperCase().indexOf(filter) > -1) {
  //         item.style.display = "";
  //         // Si es una subsección, también muestra su sección padre
  //         if (item.classList.contains("subsection-item")) {
  //           const parentSection = item.closest(".section-subsections")?.previousElementSibling;
  //           if (parentSection) {
  //             parentSection.style.display = "";
  //           }
  //         }
  //       } else {
  //         item.style.display = "none";
  //       }
  //     }
  //   });
  // };

  // Componente para cada ítem de subsección
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

  // Componente para cada ítem de sección
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
                <i className={`bx ${isExpanded ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
              </div>
            )}
          </Link>
        </li>
        {hasSubsections && isExpanded && subsections && (
          <ul className="list-unstyled section-subsections mb-0">
            {subsections.map((subsection, subIndex) => (
              <SubsectionItem
                key={subIndex}
                title={subsection.title}
                isActive={activeSection === title.toLowerCase() && activeSubsection === subsection.title.toLowerCase()}
              />
            ))}
          </ul>
        )}
      </>
    );
  };

  return (
    <>
      <div>
        <div className="px-4 pt-4">
          <div className="d-flex align-items-start">
            <div className="flex-grow-1">
              <h4 className="mb-4">Administración</h4>
            </div>
          </div>
          {/* <Form>
            <div className="input-group mb-3">
              <Input
                onKeyUp={searchSections}
                id="searchSections"
                type="text"
                className="form-control bg-light border-0 pe-0"
                placeholder="Buscar sección..."
              />
              <Button color="light" type="button" id="searchbtn-addon">
                <i className="bx bx-search align-middle"></i>
              </Button>
            </div>
          </Form> */}
        </div>
        <AppSimpleBar className="section-list">
          <ul className="list-unstyled section-list-unstyled mb-0">
            {predefinedSections.map((section, index) => (
              <SectionItem
                key={index}
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
    </>
  );
};

export default Administracion;