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

    this.iframe.contentWindow.postMessage({
      type: 'updateConfig',
      config: config
    }, '*');

    this.iframe.contentWindow.postMessage({
      type: 'setWebViewPath',
      webview_path: '/'
    }, '*');
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

  on_file_change(event, dropped_files = null)
  {
    const files = Array.from(dropped_files || event.target.files);

    const has_gltf = files.some(file => file.name.toLowerCase().endsWith('.gltf'));

    if (!has_gltf)
    {
      const file = files.find(file => file.name.toLowerCase().endsWith('.glb'));
      if (!file)
      {
        alert('Please select a valid file');
        return;
      }
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
    else if (has_gltf)
    {
      if (files.length === 1)
      {
        alert('Please select all files needed for the model or drop a folder containing the model files');
        return;
      }
      // search for a gltf file
      const file = files.find(file => file.name.toLowerCase().endsWith('.gltf'));

      if (file)
      {
        this.load_gltf_with_resources(file, files);
        this.modal.classList.add('hidden');
        this.iframe_container.classList.remove('disabled');
        this.blur.classList.add('hidden');
        this.change_model_button.classList.remove('hidden');
      }
    }
  }

  async load_gltf_with_resources(gltfFile, allFiles)
  {
    const gltfText = await gltfFile.text();
    const gltf = JSON.parse(gltfText);

    // Embed buffers as data URIs
    if (gltf.buffers)
    {
      for (const buffer of gltf.buffers)
      {
        if (buffer.uri && !buffer.uri.startsWith('data:'))
        {
          const file = allFiles.find(f => f.name === buffer.uri);
          if (file)
          {
            const arrayBuffer = await file.arrayBuffer();
            const base64 = btoa(
              new Uint8Array(arrayBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            buffer.uri = `data:application/octet-stream;base64,${base64}`;
          }
        }
      }
    }

    // Embed images as data URIs and preserve original filenames
    if (gltf.images)
    {
      for (const image of gltf.images)
      {
        if (image.uri && !image.uri.startsWith('data:'))
        {
          const file = allFiles.find(f => f.name === image.uri);
          if (file)
          {
            // Preserve the original filename in the name property
            if (!image.name)
            {
              image.name = image.uri;
            }

            const arrayBuffer = await file.arrayBuffer();
            const base64 = btoa(
              new Uint8Array(arrayBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            const mimeType = file.type || this.getMimeType(file.name);
            image.uri = `data:${mimeType};base64,${base64}`;
          }
        }
      }
    }

    // Send embedded GLTF
    const embeddedGltfJson = JSON.stringify(gltf);
    const base64String = btoa(embeddedGltfJson);

    this.iframe.contentWindow.postMessage({
      type: 'loadModelFromBase64',
      data: base64String,
      extension: 'gltf'
    }, '*');
  }

  getMimeType(filename)
  {
    const ext = filename.split('.').pop().toLowerCase();
    const mimeTypes = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      ktx2: 'image/ktx2',
      basis: 'image/basis'
    };
    return mimeTypes[ext] || 'application/octet-stream';
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

  async on_drop_drop(event)
  {
    event.preventDefault();
    this.on_drop_reset();
    const items = Array.from(event.dataTransfer.items);

    const entries = items
      .filter(item => item.kind === 'file')
      .map(item => item.webkitGetAsEntry())
      .filter(entry => entry !== null);

    // If single folder dropped, collect all files from it
    if (entries.length === 1 && entries[0].isDirectory)
    {
      const files = await this.read_directory(entries[0]);
      if (files.length > 0)
      {
        this.on_file_change(null, files);
      }
      return;
    }

    // If multiple files or mix of files/folders dropped
    const allFiles = [];
    for (const entry of entries)
    {
      if (entry.isFile)
      {
        const file = await this.get_file_from_entry(entry);
        allFiles.push(file);
      }
      else if (entry.isDirectory)
      {
        const files = await this.read_directory(entry);
        allFiles.push(...files);
      }
    }

    if (allFiles.length > 0)
    {
      this.on_file_change(null, allFiles);
    }
  }

  async get_file_from_entry(fileEntry)
  {
    return new Promise((resolve, reject) =>
    {
      fileEntry.file(resolve, reject);
    });
  }

  async read_directory(directoryEntry)
  {
    const files = [];
    const reader = directoryEntry.createReader();

    const read_entries = async() =>
    {
      return new Promise((resolve, reject) =>
      {
        reader.readEntries(resolve, reject);
      });
    };

    // Keep reading until no more entries (readEntries can return in batches)
    let entries = await read_entries();
    while (entries.length > 0)
    {
      for (const entry of entries)
      {
        if (entry.isFile)
        {
          const file = await this.get_file_from_entry(entry);
          files.push(file);
        }
        // Skip nested folders (entry.isDirectory)
      }
      entries = await read_entries();
    }

    return files;
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
