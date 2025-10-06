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

    this.blur = this.container.querySelector('.home__blur');

    // Load app
    this.iframe.src = '/webview/index.html';
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
      };
      reader.readAsArrayBuffer(file);
    }
  }
}
