import React, { useState } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Alert,
  Input,
  FormGroup,
  Label
} from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerificarCodigo = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `https://chatingbot.com.mx/api/vistaWhats/${code}`
      );

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setError("El código no es válido o ya fue usado.");
      }
    } catch (err) {
      setError("Hubo un problema al verificar el código.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="justify-content-center mt-5">
      <Col md={6} lg={5} xl={4}>
        <h3 className="mb-4 text-center">Verificar número por código</h3>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="code">Código de verificación</Label>
            <Input
              type="text"
              id="code"
              value={code}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                if (/^[A-Z0-9]{0,6}$/.test(value)) setCode(value);
              }}              
              placeholder="Ingresa tu código de 6 caracteres"
              required
            />
          </FormGroup>

          {error && <Alert color="danger">{error}</Alert>}
          {success && <Alert color="success">✅ Verificado correctamente</Alert>}

          <div className="text-center">
            <Button color="primary" type="submit" disabled={loading || !code}>
              {loading ? "Verificando..." : "Verificar"}
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default VerificarCodigo;
