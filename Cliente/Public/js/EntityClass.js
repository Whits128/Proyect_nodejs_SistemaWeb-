const url = "http://localhost:3000/api/";

class EntityClass {
  constructor() {
    this.baseUrl = url;
  }

  async excutePost(path = "", body = {}) {
    try {
        const response = await fetch(this.baseUrl + path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud POST: ${response.status} - ${response.statusText}`);
        }

        // Verifica si la respuesta es un JSON válido
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        } else {
            // Si la respuesta no es JSON, imprímela en la consola y devuelve un mensaje de error
            const text = await response.text();
            console.error("Respuesta no JSON:", text);
            throw new Error("La respuesta del servidor no es un JSON válido.");
        }
    } catch (error) {
        console.error("Error en excutePost:", error.message);
        throw error;
    }
}

  async excuteGet(path = "") {
    try {
      const response = await fetch(this.baseUrl + path, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud GET: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error en excuteGet:", error.message);
      throw error;
    }
  }

  async excutePut(path = "", body = {}) {
    try {
      const response = await fetch(this.baseUrl + path, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud PUT: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error en excutePut:", error.message);
      throw error;
    }
  }

// ... (código existente)

async excutePostConfiguracion(path = "", formData = new FormData()) {
  try {
      const response = await fetch(this.baseUrl + path, {
          method: "POST",
          body: formData,
      });

      if (!response.ok) {
          throw new Error(`Error en la solicitud POST: ${response.status} - ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
          return await response.json();
      } else {
          const text = await response.text();
          console.error("Respuesta no JSON:", text);
          throw new Error("La respuesta del servidor no es un JSON válido.");
      }
  } catch (error) {
      console.error("Error en excutePostConfiguracion:", error.message);
      throw error;
  }
}



async excutePutConfiguracion(path = "", formData = new FormData()) {
  try {
    const response = await fetch(this.baseUrl + path, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud PUT: ${response.status} - ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json();
    } else {
      const text = await response.text();
      console.error("Respuesta no JSON:", text);
      throw new Error("La respuesta del servidor no es un JSON válido.");
    }
  } catch (error) {
    console.error("Error en excutePutConfiguracion:", error.message);
    throw error;
  }
}


}

export { EntityClass };
