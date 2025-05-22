import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  Button,
  ButtonGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { FaEdit, FaTrash, FaComments, FaPlus } from "react-icons/fa";
import { ContactTypes } from "../../../data/contacts";
import { createConversation } from "../../../redux/chats/actions";
import { toast } from "react-toastify";
import {
  deleteContact,
  createContact,
  updateContact,
  getContacts,
} from "../../../redux/contacts/actions";
import { ContactsActionTypes } from "../../../redux/contacts/types";

const Contactos: React.FC = () => {
  const contacts: ContactTypes[] = useSelector(
    (state: any) => state.Contacts?.contacts || [],
  );
  const dispatch = useDispatch();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<null | ContactTypes>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // **Filtro por nombre**
  const [search, setSearch] = useState("");

  // Load contacts on mount
  useEffect(() => {
    dispatch(getContacts());
  }, [dispatch]);

  // Handler: Open modal (edit or create)
  const openModal = (contact?: ContactTypes) => {
    if (contact) {
      setEditing(contact);
      setForm({
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
        phone: contact.phone || "",
      });
    } else {
      setEditing(null);
      setForm({ firstName: "", lastName: "", email: "", phone: "" });
    }
    setModalOpen(true);
  };

  // Handler: Close modal
  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm({ firstName: "", lastName: "", email: "", phone: "" });
  };

  // Handler: Form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handler: Save contact (create or update)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.phone) {
      toast.warn("Nombre y número son obligatorios.");
      return;
    }

    // Map fields to snake_case for backend
    const mappedForm = {
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: form.phone,
    };

    if (editing) {
      dispatch(updateContact(editing.id, mappedForm));
      toast.success("Contacto actualizado.");
    } else {
      dispatch(createContact(mappedForm));
      toast.success("Contacto creado.");
    }
    closeModal();
  };

  // Handler: Delete contact
  const handleDelete = (contact: ContactTypes) => {
    if (window.confirm(`¿Eliminar el contacto ${contact.firstName}?`)) {
      dispatch(deleteContact(contact.id));
      toast.success("Contacto eliminado correctamente");
    }
  };

  // Handler: Start conversation
  const handleStartConversation = (contact: ContactTypes) => {
    dispatch(createConversation(contact.id));
  };

  // FILTRAR CONTACTOS POR NOMBRE o APELLIDO
  const filteredContacts = contacts.filter(c =>
    (c.firstName + " " + (c.lastName || ""))
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="mt-3">
      {/* Botón para agregar y buscador */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 ms-4">Contactos</h5>
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 200 }}
            bsSize="sm"
          />
          <Button color="primary" onClick={() => openModal()}>
            <FaPlus className="me-2" /> Agregar contacto
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div
        className="table-responsive"
        style={{
          maxHeight: "85vh", // o el alto que prefieras
          overflowY: "auto",
          minHeight: "150px", // para que nunca se vea chiquita con pocos registros
        }}
      >
        <Table bordered hover className="align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Número</th>
              <th>Email</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center">
                  No hay contactos registrados.
                </td>
              </tr>
            )}
            {filteredContacts.map((contact: ContactTypes) => (
              <tr key={contact.id}>
                <td>
                  {contact.firstName} {contact.lastName || ""}
                </td>
                <td>
                  {contact.phone || (
                    <em className="text-muted">No registrado</em>
                  )}
                </td>
                <td>
                  {contact.email || (
                    <em className="text-muted">No registrado</em>
                  )}
                </td>
                <td className="text-center">
                  <ButtonGroup>
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => openModal(contact)}
                      title="Editar contacto"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      color="success"
                      size="sm"
                      onClick={() => handleStartConversation(contact)}
                      title="Iniciar conversación"
                    >
                      <FaComments />
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(contact)}
                      title="Eliminar contacto"
                    >
                      <FaTrash />
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal de agregar/editar */}
      <Modal isOpen={modalOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal}>
          {editing ? "Editar contacto" : "Agregar contacto"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSave}>
            <FormGroup>
              <Label>Nombre *</Label>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                autoFocus
              />
            </FormGroup>
            <FormGroup>
              <Label>Apellido</Label>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Correo electrónico</Label>
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
              />
            </FormGroup>
            <FormGroup>
              <Label>Número *</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <ModalFooter>
              <Button color="secondary" onClick={closeModal}>
                Cancelar
              </Button>
              <Button color="primary" type="submit">
                Guardar
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Contactos;
