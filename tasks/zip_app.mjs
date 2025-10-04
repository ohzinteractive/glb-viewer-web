import archiver from 'archiver';
import fs from 'fs';

class ZipApp
{
  zip(src)
  {
    try
    {
      const name = this.get_build_name();
      const output = fs.createWriteStream(name);
      const archive = archiver('zip');

      output.on('close', () =>
      {
        console.log(`Zip created at ${name}`);
        // console.log(archive.pointer() + ' total bytes');
      });

      archive.on('error', (err) =>
      {
        throw err;
      });

      archive.pipe(output);

      // append files from a sub-directory, putting its contents at the root of archive
      archive.directory(src, false);

      archive.finalize();
    }
    catch (e)
    {
      console.error('Error:', e);
    }
  }

  get_build_name()
  {
    const package_json = JSON.parse(fs.readFileSync('./package.json'));

    const app_name = package_json.name;
    const app_version = package_json.version;

    return `builds/${app_name}_v${app_version}.zip`;
  }
}

const zip_app = new ZipApp();
zip_app.zip('./dist');
