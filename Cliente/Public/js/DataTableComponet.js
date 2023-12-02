class TableComponent extends HTMLElement {
  constructor(config = { Dataset: [], Functions: [], ShowDeleteButton: false }) {
    super();
    this.config = config;
    this.table = this.renderElement({ tagName: "table", className: "tableClass1" });
    this.thead = this.renderElement({ tagName: "thead" });
    this.tbody = this.renderElement({ tagName: "tbody" });
    this.filter = this.renderElement({
      tagName: 'div',
      className: 'FormContainer1',
      children: [
        {
          tagName: 'input',
          type: 'text',
          className: 'text',
          placeholder: 'Buscar',
          onchange: (ev) => {
            const filteredDataset = this.config.Dataset.filter((element) => {
              for (const prop in element) {
                if (element[prop] != null) {
                  if (element[prop].toString().toUpperCase().includes(ev.target.value.toUpperCase())) {
                    return true;
                  }
                }
              }
              return false;
            });
            this.DrawTableComponent(filteredDataset);
          }
        }
      ]
    });

    // Crear el footer
    this.tfoot = this.renderElement({ tagName: 'tfoot' });

    // Agregar texto junto al selector para mostrar la cantidad de elementos por página
    this.pageLabel = this.renderElement({
      tagName: 'span',
      textContent: 'Mostrar por página: '
    });

    // Agregar control para seleccionar la cantidad de elementos por página
    this.pageSelect = this.renderElement({
      tagName: 'select',
      className: 'page-select',
      onchange: (ev) => {
        this.itemsPerPage = parseInt(ev.target.value);
        this.currentPage = 1;
        this.DrawTableComponent();
      },
      children: [
        { tagName: 'option', textContent: '5', value: '5' },
        { tagName: 'option', textContent: '10', value: '10' },
        { tagName: 'option', textContent: '20', value: '20' },
        { tagName: 'option', textContent: '100', value: '100' },
        { tagName: 'option', textContent: '500', value: '500' }
      ]
    });

    // Cantidad predeterminada de elementos por página y página actual
    this.itemsPerPage = 5;
    this.currentPage = 1;

    this.table.append(this.thead, this.tbody, this.tfoot);
    this.append(this.filter, this.pageLabel, this.pageSelect, this.table);
    this.DrawTableComponent();
  }

  connectedCallback() {}

  renderElement({ tagName, className, children, textContent, onclick, placeholder, type, onchange, colspan }) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (children) {
      children.forEach(child => {
        const childElement = this.renderElement(child);
        element.appendChild(childElement);
      });
    }
    if (textContent) element.textContent = textContent;
    if (placeholder) element.placeholder = placeholder;
    if (type) element.type = type;
    if (onchange) element.onchange = onchange;
    if (onclick) element.onclick = onclick;
    if (colspan) element.colSpan = colspan;
    return element;
  }

  DrawTableComponent(Dataset = this.config.Dataset, actionHeader = "Action") {
    this.tbody.innerHTML = "";

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const visibleDataset = Dataset.slice(startIndex, endIndex);

    // Crear encabezados de columna
    const headers = Object.keys(visibleDataset[0]);
    const headerRow = this.renderElement({
      tagName: 'tr',
      children: headers.map(header => ({
        tagName: 'th',
        textContent: header
      })).concat([{ tagName: 'th', textContent: actionHeader }])
    });

    this.thead.innerHTML = "";
    this.thead.appendChild(headerRow);

    // Crear filas de datos
    visibleDataset.forEach((data) => {
      const tr = this.renderElement({ tagName: "tr" });
      headers.forEach(header => {
        const td = this.renderElement({ tagName: "td" });

        // Si es una columna de estado, aplicar estilos o iconos según el estado
        if (header === "Estado") {
          if (data[header]) {
            td.textContent = "Activo";
            td.style.color = "green";
          } else {
            td.textContent = "Inactivo";
            td.style.color = "red";
          }
        } else {
          td.textContent = data[header];
        }

        tr.appendChild(td);
      });

      // Agregar celdas de acción
      if (this.config.Functions) {
        const actionCell = this.renderElement({ tagName: "td" });
        this.config.Functions.forEach((actionFn) => {
          const actionButton = this.renderElement({
            tagName: "button",
            textContent: actionFn.label,
            onclick: () => actionFn.action(data)
          });
          actionCell.appendChild(actionButton);
        });
        tr.appendChild(actionCell);
      }

      this.tbody.appendChild(tr);
    });

    // Agregar botones "Anterior" y "Siguiente"
    const paginationRow = this.renderElement({
      tagName: 'tr',
      children: [{
        tagName: 'td',
        colspan: headers.length,
        children: [
          {
            tagName: 'button',
            className: 'pagination-button',
            textContent: 'Anterior',
            onclick: () => this.showPreviousPage()
          },
          {
            tagName: 'button',
            className: 'pagination-button',
            textContent: 'Siguiente',
            onclick: () => this.showNextPage()
          }
        ]
      }]
    });
    this.tfoot.innerHTML = "";
    this.tfoot.appendChild(paginationRow);

    // Agregar información sobre el total de filas y elementos mostrados
    const infoRow = this.renderElement({
      tagName: 'tr',
      children: [{
        tagName: 'td',
        colspan: headers.length,
        textContent: `Mostrando ${visibleDataset.length} de ${Dataset.length} Elementos`
      }]
    });
    this.tfoot.appendChild(infoRow);
  }

  showPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.DrawTableComponent();
    }
  }

  showNextPage() {
    const maxPages = Math.ceil(this.config.Dataset.length / this.itemsPerPage);
    if (this.currentPage < maxPages) {
      this.currentPage++;
      this.DrawTableComponent();
    }
  }
}

customElements.define('w-table', TableComponent);

export { TableComponent };
