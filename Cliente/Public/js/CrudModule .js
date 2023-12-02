class CrudModule {
    constructor(entityName) {
      this.url = `http://localhost:3000/api/${entityName}/`;
    }
  
    // Método para realizar una solicitud POST
    async create(data) {
      try {
        const response = await fetch(this.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          const responseJson = await response.json();
          return responseJson;
        } else {
          throw new Error("Error en la solicitud POST");
        }
      } catch (error) {
        console.error("Error en la solicitud POST:", error);
        throw error;
      }
    }
  
    // Método para realizar una solicitud GET
    async read(id) {
      try {
        const path = id ? `${id}` : "";
        const response = await fetch(this.url + path, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          const responseJson = await response.json();
          return responseJson;
        } else {
          throw new Error("Error en la solicitud GET");
        }
      } catch (error) {
        console.error("Error en la solicitud GET:", error);
        throw error;
      }
    }
  
    // Método para realizar una solicitud PUT
    async update(id, data) {
      try {
        const response = await fetch(this.url + id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          const responseJson = await response.json();
          return responseJson;
        } else {
          throw new Error("Error en la solicitud PUT");
        }
      } catch (error) {
        console.error("Error en la solicitud PUT:", error);
        throw error;
      }
    }
  
    // Método para realizar una solicitud DELETE
    async delete(id) {
      try {
        const response = await fetch(this.url + id, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          const responseJson = await response.json();
          return responseJson;
        } else {
          throw new Error("Error en la solicitud DELETE");
        }
      } catch (error) {
        console.error("Error en la solicitud DELETE:", error);
        throw error;
      }
    }
  }
  
  export { CrudModule };
  