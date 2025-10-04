
class PreLoader
{
  async init()
  {
    console.log(atob('RGVzaWduZWQgJiBEZXZlbG9wZWQgYnkgT0haSSBJbnRlcmFjdGl2ZSBTdHVkaW8gLyBodHRwczovL29oemkuaW8='));

    const api = await import('./Api');

    api.Api.init();
  }
}

const pre_loader = new PreLoader();
export { pre_loader as PreLoader };
