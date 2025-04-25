import React, { useState } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Alert,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import axios from "axios";

const VerificarCodigo = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://chatingbot.com.mx/api/verificar-codigo",
        { code }
      );

      console.log("✅ Verificación exitosa:", response);

      if (response.status === 200) {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
          localStorage.setItem(
            "authUser",
            JSON.stringify({
              token: storedToken,
            })
          );
        }

        setSuccess(true);
      }
    } catch (err: any) {
      console.error("❌ Error al verificar:", err);

      if (err.response) {
        const status = err.response.status;
        const msg = err.response.data?.message || "Error desconocido.";

        if (status === 404 || status === 409) {
          setError(msg);
        } else {
          setError("Error del servidor. Intenta más tarde.");
        }
      } else {
        setError("No se pudo conectar al servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="justify-content-center mt-5">
      <Col md={6} lg={5} xl={4}>
        <h3 className="mb-4 text-center">Verificar número por código</h3>

        {!success ? (
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

            <div className="text-center">
              <Button
                color="primary"
                type="submit"
                disabled={loading || !code}
              >
                {loading ? "Verificando..." : "Verificar"}
              </Button>
            </div>
          </Form>
        ) : (
          <>
            <Alert color="success">✅ Verificado correctamente</Alert>
            <div className="text-center mt-3">
              <Button
                color="success"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Ir al Dashboard
              </Button>
            </div>
          </>
        )}
      </Col>
    </Row>
  );
};

export default VerificarCodigo;
