import React, { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle, FaEdit, FaTrash } from "react-icons/fa";
import { RootState } from "../../../redux/store";
import {
  fetchConexionesRequest,
  deleteConexionRequest,
  createConexionRequest,
  updateConexionRequest,
  setAsDefaultRequest,
} from "../../../redux/administracion/actions";
import { Connection } from "../../../redux/administracion/types";
import echo from "../../../echo";

type QrButtonProps = {
  conn: Connection;
  onShowQr: (qr: string) => void;
};

const QrButton = memo(function QrButton({ conn, onShowQr }: QrButtonProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!conn.connection_id) return;
    const channel = echo.channel(`connection.${conn.connection_id}`);
    channel.listen(".qr.updated", () => dispatch(fetchConexionesRequest()));
    return () => echo.leave(`connection.${conn.connection_id}`);
  }, [conn.connection_id, dispatch]);

  if (conn.session_status === "ready")
    return (
      <button
        onClick={() =>
          dispatch({
            type: "@@administracion/LOGOUT_CONEXION_REQUEST",
            payload: conn.connection_id,
          })
        }
        className="text-red-600 hover:underline"
      >
        Cerrar sesión
      </button>
    );
 if (conn.session_status === "pending" && conn.qr_code)
  return (
    <button
      onClick={() => {
        if (conn.qr_code) onShowQr(conn.qr_code);
      }}
      className="text-green-700 font-semibold hover:underline"
    >
      Leer QR
    </button>
  );

  if (conn.session_status === "pending")
    return <span className="text-gray-400">Esperando QR...</span>;
  return <span className="text-gray-400">Estado desconocido</span>;
});

const Conexiones: React.FC = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector(
    (state: RootState) => state.Administracion.conexiones
  );
  const [showModal, setShowModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
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

  useEffect(() => {
    const channel = echo.channel("public-connections");
    channel.listen(".ConnectionStatusUpdated", () =>
      dispatch(fetchConexionesRequest())
    );
    return () => echo.leave("public-connections");
  }, [dispatch]);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSetAsDefault = (id: number) => {
    dispatch(setAsDefaultRequest(id));
  };

  useEffect(() => {
    if (!qrImage || !showQrModal) return;
    const match = list.find(
      (conn: Connection) =>
        conn.qr_code === qrImage && conn.session_status === "ready"
    );
    if (match) {
      setShowQrModal(false);
      setQrImage(null);
    }
  }, [list, qrImage, showQrModal]);

  return (
    <div className="p-8 bg-gradient-to-br from-lime-100 via-emerald-50 to-white min-h-screen">
      <h1 className="text-4xl font-black text-emerald-700 mb-10 text-center drop-shadow">
        <span className="inline-block px-4 py-2 bg-gradient-to-r from-lime-200 via-emerald-100 to-white rounded-xl">
          Conexiones
        </span>
      </h1>

      <div className="bg-white/90 rounded-xl shadow-lg overflow-hidden border border-emerald-200">
        {list.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-lg">🚫 No hay conexiones registradas</p>
          </div>
        ) : (
          <>
            <div className="text-center text-sm text-emerald-600 py-2 h-6">
              {loading ? "⏳ Actualizando conexiones..." : "\u00A0"}
            </div>

            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-lime-200 via-emerald-100 to-white text-emerald-900">
                <tr>
                  <th className="px-6 py-3 text-left">Nombre</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3">Sesión</th>
                  <th className="px-6 py-3">Última actualización</th>
                  <th className="px-6 py-3">Predeterminada</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100">
                {list.map((conn: Connection) => (
                  <tr key={conn.connection_id} className="hover:bg-lime-50">
                    <td className="px-6 py-3 font-medium">{conn.name}</td>
                    <td className="px-6 py-3 text-center">
                      {conn.session_status === "ready" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                          Conectado
                        </span>
                      ) : (
                        <span className="text-yellow-600">Desconectado</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <QrButton
                        conn={conn}
                        onShowQr={(qr) => {
                          setQrImage(qr);
                          setShowQrModal(true);
                        }}
                      />
                    </td>
                    <td className="px-6 py-3 text-center">
                      {formatDate(conn.updated_at)}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {conn.is_team_default && (
                        <FaCheckCircle className="text-emerald-500 mx-auto" title="Predeterminada" />
                      )}
                    </td>
                    <td className="px-6 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(conn)}
                        className="hover:text-amber-500 text-amber-700 transition"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleRemove(conn.id)}
                        className="hover:text-red-600 text-red-500 transition"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                      {!conn.is_team_default && (
                        <button
                          onClick={() => handleSetAsDefault(conn.id)}
                          className="ml-2 text-emerald-600 underline font-semibold"
                        >
                          Marcar predeterminada
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
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
          className="bg-emerald-500 hover:bg-emerald-600 text-black px-6 py-2 rounded-xl shadow font-bold transition-all"
        >
          + Nueva Conexión
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border-2 border-emerald-200">
            <h2 className="text-2xl font-extrabold mb-4 text-emerald-600">
              {editingId ? "Editar Conexión" : "Agregar Nueva Conexión"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={formData.name}
                placeholder="Nombre"
                onChange={handleChange}
                className="w-full border border-emerald-200 focus:border-emerald-400 p-2 rounded-lg"
                required
              />
              <textarea
                name="greeting_message"
                placeholder="Mensaje de bienvenida"
                onChange={handleChange}
                value={formData.greeting_message}
                className="w-full border border-emerald-200 focus:border-emerald-400 p-2 rounded-lg"
              />
              <textarea
                name="farewell_message"
                placeholder="Mensaje de despedida"
                onChange={handleChange}
                value={formData.farewell_message}
                className="w-full border border-emerald-200 focus:border-emerald-400 p-2 rounded-lg"
              />
              <textarea
                name="off_hours_message"
                placeholder="Mensaje fuera de horario"
                onChange={handleChange}
                value={formData.off_hours_message}
                className="w-full border border-emerald-200 focus:border-emerald-400 p-2 rounded-lg"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showQrModal && qrImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center border-2 border-emerald-200">
            <h2 className="text-xl font-bold mb-4 text-emerald-700">
              Escanea el código QR
            </h2>
            <img src={qrImage} alt="QR Code" className="mx-auto w-48" />
            <div className="mt-4">
              <button
                onClick={() => {
                  setShowQrModal(false);
                  setQrImage(null);
                }}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conexiones;
