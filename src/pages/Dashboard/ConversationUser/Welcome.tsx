import React from "react";
import {Col, Row } from "reactstrap";

const Welcome = () => {
  return (
    <React.Fragment>
      <div className="chat-welcome-section">
        <Row className="w-100 justify-content-center">
          <Col xxl={5} md={7}>
            <div className="p-4 text-center">
              <div className="avatar-xl mx-auto mb-4">
                <div className="avatar-title bg-soft-primary rounded-circle">
                  <i className="fa-solid fa-robot fa-3x"></i>
                </div>
              </div>
              <h4>Bienvenido a ChattingBot</h4>
              <p className="text-muted mb-4">
              Este CRM Chatbot es una solución inteligente que fusiona la eficiencia de un sistema de gestión de relaciones con clientes (CRM) con la inmediatez de un chat interactivo
              </p>
              {/* <Button type="button" className="btn btn-primary w-lg">
                Get Started
              </Button> */}
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Welcome;
