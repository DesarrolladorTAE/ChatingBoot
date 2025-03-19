import React, { useState, useEffect } from "react";

// Define la interfaz para una respuesta rápida
interface QuickResponse {
  id: number;
  text: string;
}

const RespuestasRapidas: React.FC = () => {
  // Estado para almacenar la lista de respuestas rápidas
  const [responses, setResponses] = useState<QuickResponse[]>([]);
  // Estado para el input de una nueva respuesta
  const [newResponse, setNewResponse] = useState<string>("");

  // Cargar respuestas almacenadas (por ejemplo, desde localStorage)
  useEffect(() => {
    const savedResponses = localStorage.getItem("quickResponses");
    if (savedResponses) {
      setResponses(JSON.parse(savedResponses));
    }
  }, []);

  // Función para agregar una nueva respuesta
  const addResponse = () => {
    if (newResponse.trim() === "") return;
    const newItem: QuickResponse = {
      id: Date.now(),
      text: newResponse.trim(),
    };
    const updatedResponses = [...responses, newItem];
    setResponses(updatedResponses);
    setNewResponse("");
    // Guardamos en localStorage para persistir (o despachar una acción de Redux)
    localStorage.setItem("quickResponses", JSON.stringify(updatedResponses));
  };

  // Función para eliminar una respuesta
  const deleteResponse = (id: number) => {
    const updatedResponses = responses.filter((resp) => resp.id !== id);
    setResponses(updatedResponses);
    localStorage.setItem("quickResponses", JSON.stringify(updatedResponses));
  };

  return (
    <div className="respuestas-rapidas-section">
      <h2>Respuestas Rápidas</h2>
      <div className="add-response">
        <input
          type="text"
          value={newResponse}
          onChange={(e) => setNewResponse(e.target.value)}
          placeholder="Escribe una nueva respuesta rápida..."
        />
        <button onClick={addResponse}>Agregar</button>
      </div>
      <ul>
        {responses.map((response) => (
          <li key={response.id}>
            <span>{response.text}</span>
            <button onClick={() => deleteResponse(response.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RespuestasRapidas;
