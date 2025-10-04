import fs from 'fs';

class RemoveCache
{
  remove()
  {
    try
    {
      // Remove cache and dist folders to prevent chaching issues
      fs.rmSync('dist', { recursive: true, force: true });
    }
    catch (e)
    {
      console.error('Error:', e);
    }
  }
}

const remove_cache = new RemoveCache();
remove_cache.remove();
