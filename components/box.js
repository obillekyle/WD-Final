export class WBox extends HTMLElement {
  constructor() {
    super();
  }
}

customElements.define('w-app', class extends WBox {});
customElements.define('w-box', class extends WBox {});
customElements.define('w-card', class extends WBox {});
customElements.define('w-header', class extends WBox { });
customElements.define('w-breakpoint', class extends WBox {});
customElements.define('w-content', class extends WBox { });
