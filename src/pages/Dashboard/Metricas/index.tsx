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
}

interface IndexProps {}

const Metricas = (props: IndexProps) => {
  // global store
  const { dispatch } = useRedux();

  // Estado para la sección actualmente seleccionada
  const [activeSection, setActiveSection] = useState<string>("resumen");

  // Ahora solo dos secciones relacionadas con métricas
  const predefinedSections: SectionProps[] = [
    { icon: "bx-bar-chart-alt-2", title: "Atención y Estado de Tickets", count: 0 },
    { icon: "bx-line-chart", title: "Tiempos de Servicio", count: 2 },
  ];

  const handleSectionClick = (sectionTitle: string) => {
    setActiveSection(sectionTitle.toLowerCase());
    // Aquí puedes disparar acciones de Redux según la sección seleccionada
    // dispatch(changeSelectedSection(sectionTitle.toLowerCase()));
  };

  const searchSections = () => {
    const inputValue: any = document.getElementById("searchSections");
    const filter: any = inputValue.value.toUpperCase();
    const sectionItems = document.querySelectorAll(".section-item");

    sectionItems.forEach((item: any) => {
      const titleElement = item.querySelector(".section-title");
      if (titleElement) {
        const txtValue = titleElement.textContent || titleElement.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      }
    });
  };

  // Componente para cada ítem de sección
  const SectionItem = ({ icon, title, count, isActive }: SectionProps) => {
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
              <span className="badge badge-soft-dark rounded px-1">{count}</span>
            </div>
          )}
        </Link>
      </li>
    );
  };

  return (
    <>
      <div>
        <div className="px-4 pt-4">
          <div className="d-flex align-items-start">
            <div className="flex-grow-1">
              <h4 className="mb-4">Atención</h4>
            </div>
          </div>
          <Form>
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
          </Form>
        </div>
        {/* .p-4 */}
        <AppSimpleBar className="section-list">
          <ul className="list-unstyled section-list-unstyled mb-0">
            {predefinedSections.map((section, index) => (
              <SectionItem
                key={index}
                icon={section.icon}
                title={section.title}
                count={section.count}
                isActive={activeSection === section.title.toLowerCase()}
              />
            ))}
          </ul>
        </AppSimpleBar>
      </div>
    </>
  );
};

export default Metricas;
