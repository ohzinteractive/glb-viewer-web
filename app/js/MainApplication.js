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

      if (event.data.type === 'openJson')
      {
        alert('openJson not implemented on web yet');
      }

      if (event.data.type === 'openAsText')
      {
        alert('openAsText not implemented on web yet');
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
}
