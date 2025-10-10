import { Sections, SectionsURLs } from '../Sections';

export class HomeView
{
  constructor()
  {
    this.name = Sections.HOME;
    this.url = SectionsURLs.HOME;
    this.container = document.querySelector('.home');
  }

  start()
  {
    this.iframe_container = this.container.querySelector('.home__iframe');
    this.iframe = this.container.querySelector('.home__iframe iframe');

    this.modal = this.container.querySelector('.home__modal');
    this.modal_content = this.container.querySelector('.home__modal-content');
    this.modal_loading = this.container.querySelector('.home__modal-loading');

    this.change_model_button = this.container.querySelector('.home__change-model-button');

    this.input = this.container.querySelector('.home__modal-input');

    this.blur = this.container.querySelector('.home__blur');

    // Load app
    this.iframe.src = import.meta.env.DEV ? 'http://localhost:1235/webview/' : '/webview/index.html';

    this.drop_area = this.container.querySelector('.home__drop-area');
    this._dragEnterCount = 0;

    document.body.addEventListener('dragenter', this.on_drop_dragenter.bind(this));
    document.body.addEventListener('dragover', this.on_drop_dragover.bind(this));
    document.body.addEventListener('dragleave', this.on_drop_dragleave.bind(this));
    document.body.addEventListener('dragend', this.on_drop_reset.bind(this));
    document.body.addEventListener('drop', this.on_drop_drop.bind(this));

    const model_url = import.meta.env.DEV ? 'http://localhost:1234/models/' : '/models/';
    this.examples = {
      chick: {
        name: 'Chick',
        url: model_url + 'chick.glb'
      },
      cubohzi: {
        name: 'Cubozi',
        url: model_url + 'cubohzi.glb'
      },
      toy_car: {
        name: 'Toy Car',
        url: model_url + 'toy_car.glb'
      }
    };
  }

  on_iframe_ready()
  {
    // TODO: Add ability to modify these settings from web
    const config = {
      prettifyPropertyLabels: true,
      relevant3dObjectKeys: [
        'name',
        'type',
        'position',
        'rotation',
        'scale',
        'globalScale',
        'userData'
      ]
    };

    this.modal.classList.remove('hidden');

    // console.log('WebView is ready');
    this.iframe.contentWindow.postMessage({
      type: 'updateConfig',
      config: config
    });

    this.iframe.contentWindow.postMessage({
      type: 'setWebViewPath',
      webview_path: '/'
    });
  }

  on_enter()
  {
    this.container.classList.remove('hidden');
  }

  on_exit()
  {
    this.container.classList.add('hidden');
  }

  update()
  {
  }

  trigger_file_input()
  {
    this.input.click();
  }

  on_file_change(event)
  {
    const file = event.target.files[0];
    if (file)
    {
      this.modal_content.classList.add('hidden');
      this.modal_loading.classList.remove('hidden');

      const reader = new FileReader();
      reader.onload = (e) =>
      {
        const arrayBuffer = e.target.result;
        const base64String = btoa(
          new Uint8Array(arrayBuffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        // Send the base64 string to the WebView
        this.iframe.contentWindow.postMessage({
          type: 'loadModelFromBase64',
          data: base64String,
          extension: file.name.split('.').pop().toLowerCase()
        }, '*');

        this.modal.classList.add('hidden');
        this.iframe_container.classList.remove('disabled');
        this.blur.classList.add('hidden');
        this.change_model_button.classList.remove('hidden');
      };
      reader.readAsArrayBuffer(file);
    }
  }

  on_drop_dragenter(event)
  {
    event.preventDefault();
    this._dragEnterCount += 1;

    // Only show drop area on first enter
    if (this._dragEnterCount > 1)
    {
      return;
    }

    this.drop_area.classList.add('visible');
  }

  on_drop_dragover(event)
  {
    event.preventDefault();
  }

  on_drop_dragleave(event)
  {
    event.preventDefault();
    this._dragEnterCount -= 1;

    // Only hide when we've left all elements
    if (this._dragEnterCount === 0)
    {
      this.on_drop_reset();
    }
  }

  on_drop_drop(event)
  {
    event.preventDefault();
    this.on_drop_reset();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0)
    {
      console.log('drop', files);
      // TODO: Handle the dropped files
    }
  }

  on_drop_reset()
  {
    this._dragEnterCount = 0;
    this.drop_area.classList.remove('visible');
  }

  async on_example_click(index)
  {
    this.modal_content.classList.add('hidden');
    this.modal_loading.classList.remove('hidden');

    const response = await fetch(this.examples[index].url);
    const arrayBuffer = await response.arrayBuffer();

    // Convert to base64
    const base64String = btoa(
      new Uint8Array(arrayBuffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    this.iframe.contentWindow.postMessage({
      type: 'loadModelFromBase64',
      data: base64String,
      extension: 'glb'
    }, '*');

    this.modal.classList.add('hidden');
    this.iframe_container.classList.remove('disabled');
    this.blur.classList.add('hidden');
    this.change_model_button.classList.remove('hidden');
  }

  on_change_model_click()
  {
    this.modal.classList.remove('hidden');
    this.modal_content.classList.remove('hidden');
    this.iframe_container.classList.add('disabled');
    this.blur.classList.remove('hidden');
    this.input.value = '';
    this.modal_loading.classList.add('hidden');
    this.change_model_button.classList.add('hidden');
  }
}
