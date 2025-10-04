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
}
