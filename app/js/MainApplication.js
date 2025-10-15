import { HomeView } from './views/home/HomeView';

export class MainApplication
{
  constructor()
  {
  }

  start()
  {
    window.addEventListener('message', (event) =>
    {
      console.log('Message received:', event.data);

      if (event.data.type === 'ready')
      {
        this.home_view.on_iframe_ready();
      }

      if (event.data.type === 'openJson' || event.data.type === 'openAsText')
      {
        this.open_info_in_new_tab(event.data.payload);
      }
    });

    this.home_view = new HomeView();
    this.home_view.start();

    // Go to home view
    this.home_view.on_enter();
  }

  update()
  {
    this.home_view.update();
  }

  open_info_in_new_tab(payload)
  {
    if (!payload)
    {
      console.warn('No payload provided for openAsText/openJson');
      return;
    }

    let content = '';
    let mimeType = '';
    let filename = '';

    content = JSON.stringify(payload, null, 2);
    mimeType = 'application/json';
    filename = 'data.json';

    // Create a blob with the content
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    // Open in new tab
    const newTab = window.open(url, '_blank');

    // Set a timeout to revoke the URL after a delay to allow the tab to load
    setTimeout(() =>
    {
      URL.revokeObjectURL(url);
    }, 1000);

    // If popup was blocked, fallback to download
    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined')
    {
      this.download_payload(content, filename, mimeType);
    }
  }

  download_payload(content, filename, mimeType)
  {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
}
