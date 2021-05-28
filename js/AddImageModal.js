class AddImageModal extends HTMLElement {
  style = `
    .message {
      background-color: #6d410c;
      border: 1px solid #845011;
      color: #d4c3ae;
      display: none;
      margin: 0 0 20px;
      padding: 10px 14px;
    }

    .message.show {
      display: block;
    }

    .label {
      color: var(--text-color2);
      display: block;
      margin: 0 0 10px;
    }

    .inputs {
      display: flex;
      justify-content: center;
      margin: 0 0 20px;
    }

    .inputs text-input {
      width: 100px;
    }

    .inputs p {
      align-items: center;
      color: var(--text-color2);
      display: flex;
      flex-shrink: 0;
      margin: 16px 15px 0;
    }
  `;
  template = `
    <modal-dialog id="modal" title="Add Image" width="auto">
      <div class="message" id="message"></div>
      <form id="add-image-form">
        <label class="label">Resize image by:</label>
        <div class="inputs">
          <text-input
            default="auto"
            id="image-height"
            label="Height"
            name="height"
          >
          </text-input>
          <p>or</p>
          <text-input
            default="600"
            id="image-width"
            label="Width"
            name="width"
          >
          </text-input>
        </div>
        <modal-dialog-footer>
          <ui-button id="cancel-btn">Cancel</ui-button>
          <ui-button
            id="create-image-btn"
            primary
            style="margin: 0 0 0 10px"
          >
            Create
          </ui-button>
        </modal-dialog-footer>
      </form>
    </modal-dialog>
  `;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.innerHTML = this.style;
    shadow.innerHTML = this.template;
    shadow.appendChild(style);

    this.elModal = shadow.querySelector('#modal');
    this.elCancelBtn = shadow.querySelector('#cancel-btn');
    this.elAddBtn = shadow.querySelector('#create-image-btn');
    this.elMessage = shadow.querySelector('#message');
    this.elHeightInput = shadow.querySelector('[name=height]');
    this.elWidthInput = shadow.querySelector('[name=width]');
  }

  onHeightInputBlur = () => {
    if (isNaN(this.elHeightInput.value)) {
      this.elHeightInput.value = 'auto';
    } else {
      this.elWidthInput.value = 'auto';
    }
  };

  onWidthInputBlur = () => {
    if (isNaN(this.elWidthInput.value)) {
      this.elWidthInput.value = 'auto';
    } else {
      this.elHeightInput.value = 'auto';
    }
  };

  open = () => {
    this.elAddBtn.addEventListener('click', this.onAddBtnClick);
    this.elCancelBtn.addEventListener('click', this.onCloseBtnClick);
    this.elHeightInput.addEventListener('blur', this.onHeightInputBlur);
    this.elWidthInput.addEventListener('blur', this.onWidthInputBlur);

    this.elModal.open();
  };

  close = () => {
    this.elAddBtn.removeEventListener('click', this.onAddBtnClick);
    this.elCancelBtn.removeEventListener('click', this.onCloseBtnClick);
    this.elHeightInput.removeEventListener('blur', this.onHeightInputBlur);
    this.elWidthInput.removeEventListener('blur', this.onWidthInputBlur);

    this.elModal.close();

    this.elMessage.innerHTML = '';
    this.elMessage.classList.remove('show');
  };

  onCloseBtnClick = (evt) => {
    evt.preventDefault();

    this.close();
  };

  onAddBtnClick = (evt) => {
    evt.preventDefault();

    let height = parseFloat(this.elHeightInput.value);
    let width = parseFloat(this.elWidthInput.value);

    if (isNaN(height) && isNaN(width)) {
      this.elMessage.innerHTML = 'One of height or width must be a number!';
      this.elMessage.classList.add('show');
    } else {
      const addImageEvent = new CustomEvent('image-added', {
        detail: {
          height: isNaN(height) ? undefined : height,
          width: isNaN(width) ? undefined : width,
        },
      });
      this.dispatchEvent(addImageEvent);
    }
  };
}

customElements.define('add-image-modal', AddImageModal);
