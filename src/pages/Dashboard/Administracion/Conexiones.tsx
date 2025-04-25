import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle, FaEdit, FaTrash } from "react-icons/fa";
import { RootState } from "../../../redux/store";
import {
  fetchConexionesRequest,
  disconnectConexionRequest,
  deleteConexionRequest,
  createConexionRequest,
  updateConexionRequest,
  startSessionRequest,
  fetchQrRequest,
  clearQrCode,
  setAsDefaultRequest,
} from "../../../redux/administracion/actions";
import { Connection } from "../../../redux/administracion/types";

const Conexiones: React.FC = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector(
    (state: RootState) => state.Administracion.conexiones,
  );

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    is_team_default: false,
    greeting_message: "",
    farewell_message: "",
    off_hours_message: "",
  });

  useEffect(() => {
    dispatch(fetchConexionesRequest());
  }, [dispatch]);

  const handleDisconnect = (connectionId: string) => {
    dispatch(disconnectConexionRequest(connectionId));
  };

  const handleRemove = (id: number) => {
    if (window.confirm("¿Eliminar esta conexión?")) {
      dispatch(deleteConexionRequest(id));
    }
  };

  const handleEdit = (conn: Connection) => {
    setFormData({
      name: conn.name,
      is_team_default: conn.is_team_default,
      greeting_message: conn.greeting_message || "",
      farewell_message: conn.farewell_message || "",
      off_hours_message: conn.off_hours_message || "",
    });
    setEditingId(conn.id);
    setShowModal(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      dispatch(updateConexionRequest(editingId, formData));
    } else {
      dispatch(createConexionRequest(formData));
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      is_team_default: false,
      greeting_message: "",
      farewell_message: "",
      off_hours_message: "",
    });
    setEditingId(null);
    setShowModal(false);
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStartSession = (connectionId: string) => {
    dispatch(startSessionRequest(connectionId));
    dispatch(fetchQrRequest(connectionId));
  };

  const qrCodeState = useSelector(
    (state: RootState) => state.Administracion.qrCode,
  );

  useEffect(() => {
    if (list.some((c: Connection) => c.session_status === "ready")) {
      dispatch(clearQrCode());
    }
  }, [list]);

  const handleSetAsDefault = (id: number) => {
    dispatch(setAsDefaultRequest(id)); // Aquí vas a lanzar tu nueva acción de Redux
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
        Conexiones
      </h1>

      {qrCodeState.loading && (
        <p className="text-center text-sm text-gray-500 mb-4">
          ⌛ Generando QR...
        </p>
      )}
      {qrCodeState.qr && (
        <div className="bg-white p-4 rounded-xl shadow text-center mb-6">
          <img src={qrCodeState.qr} alt="QR Code" className="mx-auto w-48" />
          <p className="text-sm text-gray-600 mt-2">
            Escanea el código con WhatsApp
          </p>
        </div>
      )}
      {qrCodeState.error && (
        <p className="text-red-500 text-sm text-center mb-4">
          ⚠️ {qrCodeState.error}
        </p>
      )}

      <div className="bg-green-50 rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-gray-500">
            Cargando conexiones...
          </div>
        ) : list.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-lg">🚫 No hay conexiones registradas</p>
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-green-100 text-green-800">
              <tr>
                <th className="px-6 py-3 text-left">Nombre</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Sesión</th>
                <th className="px-6 py-3">Última actualización</th>
                <th className="px-6 py-3">Predeterminada</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((conn: Connection) => (
                <tr key={conn.connection_id}>
                  <td className="px-6 py-3">{conn.name}</td>
                  <td className="px-6 py-3 text-center">
                    {conn.session_status === "ready" ? (
                      <span className="text-green-600 font-semibold">
                        Conectado
                      </span>
                    ) : (
                      <span className="text-yellow-600">Desconectado</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {conn.session_status !== "ready" ? (
                      <button
                        onClick={() => handleStartSession(conn.connection_id)}
                        className="text-sky-600 hover:underline"
                      >
                        Iniciar sesión
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDisconnect(conn.connection_id)}
                        className="text-red-600 hover:underline"
                      >
                        Cerrar sesión
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {formatDate(conn.updated_at)}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {conn.is_team_default ? (
                      <FaCheckCircle className="text-emerald-500 mx-auto" />
                    ) : null}
                  </td>
                  <td className="px-6 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(conn)}
                      className="text-yellow-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleRemove(conn.id)}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>
                    {!conn.is_team_default && (
                      <button
                        onClick={() => handleSetAsDefault(conn.id)}
                        className="text-emerald-600 underline ml-2"
                      >
                        Marcar predeterminada
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {error && (
        <p className="text-center text-red-500 mt-4 text-sm">
          ⚠️ Error: {error}
        </p>
      )}

<div className="flex justify-center mt-8">
  <button
    onClick={() => setShowModal(true)}
    className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-lg shadow font-semibold transition"
  >
    + Nueva Conexión
  </button>
</div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-sky-700">
              {editingId ? "Editar Conexión" : "Agregar Nueva Conexión"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={formData.name}
                placeholder="Nombre"
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <textarea
                name="greeting_message"
                placeholder="Mensaje de bienvenida"
                onChange={handleChange}
                value={formData.greeting_message}
                className="w-full border p-2 rounded"
              />
              <textarea
                name="farewell_message"
                placeholder="Mensaje de despedida"
                onChange={handleChange}
                value={formData.farewell_message}
                className="w-full border p-2 rounded"
              />
              <textarea
                name="off_hours_message"
                placeholder="Mensaje fuera de horario"
                onChange={handleChange}
                value={formData.off_hours_message}
                className="w-full border p-2 rounded"
              />
              {/* <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_team_default"
                  checked={formData.is_team_default}
                  onChange={handleChange}
                />
                <span>¿Es predeterminada del equipo?</span>
              </label> */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conexiones;
