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

    window.addEventListener('message', (event) =>
    {
      console.log('Message received:', event.data);

      if (event.data.type === 'ready')
      {
        this.modal.classList.remove('hidden');
      }
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
          data: base64String
        }, '*');

        this.modal.classList.add('hidden');
        this.iframe_container.classList.remove('disabled');
      };
      reader.readAsArrayBuffer(file);
    }
  }
}
