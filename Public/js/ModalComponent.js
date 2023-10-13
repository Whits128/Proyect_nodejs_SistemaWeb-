class ModalComponent extends HTMLElement {
    constructor(Component) {
      super();
  
      // Crear la estructura del modal
      this.modalContent = document.createElement('div');
      this.modalContent.className = 'ModalContent';
      this.modalContent.appendChild(this.createModalHeader());
      this.modalContent.appendChild(Component);
  
      this.appendChild(this.modalContent);
    }
  
    connectedCallback() {
      this.style.opacity = 1;
      this.style.display = 'block';
    }
  
    createModalHeader() {
      const modalHeader = document.createElement('div');
      modalHeader.className = 'ModalHeader';
      
      const label = document.createElement('label');
      label.innerText = 'Modal';
      
      const closeButton = document.createElement('input');
      closeButton.type = 'button';
      closeButton.className = 'btn';
      closeButton.value = 'X';
      closeButton.onclick = () => {
        this.close();
      };
  
      modalHeader.appendChild(label);
      modalHeader.appendChild(closeButton);
  
      return modalHeader;
    }
  
    close() {
      this.style.opacity = 0;
      setTimeout(() => {
        this.remove();
      }, 1000);
    }
  }
  
  customElements.define('w-modal', ModalComponent);
  export { ModalComponent };
  