import { HomeView } from './views/home/HomeView';

export class MainApplication
{
  constructor()
  {
  }

  start()
  {
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
