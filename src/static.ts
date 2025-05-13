import { encoder, Pages } from 'tetris-fumen';
import { fumenToGrid } from './fumen';

export const combo_finder = `<html>

<head>
  <link rel=stylesheet href='../../css'>
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#2c2d30">
  <meta property="og:title" content="qv | combo finder">
  <meta property="og:url" content="/tools/combo-finder">
  <meta property="og:image" content="/render?grid=j|j3g|gege|g2eg&clear=true">
  <meta property="og:description" content="Finds combo given a board and queue.">
  <title>qv | combo finder</title>
  <script>
    window.onload = async () => {

      const [fx, rx, px, hx, results] = [
        document.getElementById('fx'),
        document.getElementById('rx'),
        document.getElementById('px'),
        document.getElementById('hx'),
        document.getElementById('results')
      ];
      async function search(res, pattern, queue, hold) {
        const req = await fetch(\`/pre-render/combo?res=\${res}&pattern=\${pattern}&queue=\${queue}&hold=\${hold}\`);
        const htm = await req.text();
        results.innerHTML = htm;
      }

      async function go(t) {
        // console.log(t);
        await search(rx.value, px.value, fx.value, hx.value);
      }

      fx.onkeyup = go;
      hx.onkeyup = go;
      rx.onkeyup = go;
      px.onkeyup = go;

      search(rx.value, px.value, fx.value, hx.value);

      let ci = fx.value;
      let ci2 = hx.value;
      function minos(t, h) {
        const target = t.target;
        const c = /^[IJOLZST]*$/gi;
        h ? c.test(target.value) ? (ci2 = target.value.toUpperCase()) : (target.value = ci2.toUpperCase()) :
          c.test(target.value) ? (ci = target.value.toUpperCase()) : (target.value = ci.toUpperCase())
      };

      fx.oninput = minos;
      hx.oninput = minos;
    }
  </script>
</head>

<body>
  <h1>4W Combo Finder</h1>
  <span class=meta>
    Search for combos given queue
    <input size=7 id=fx class='mino uc'>
    </input> and <input size=1 id=hx class='mino uc' maxlength=1> in hold
    with <input size=1 id=rx type=number value=3> residuals
    on pattern <input size=2 id=px class='uc' value=1>
  </span>

  <br><br>
  <div id="results"></div>

</body>

</html>`;

export const pc_finder = `<html>

<head>
  <link rel=stylesheet href='../../css'>
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#2c2d30">
  <meta property="og:title" content="qv | pc finder">
  <meta property="og:url" content="/tools/pc-finder">
  <meta property="og:image" content="/render?grid=z2s2|lz2j|ls2j|l2j2">
  <meta property="og:description" content="Find a 4-wide PC given a board and queue.">
  <title>qv | pc finder</title>
  <script>
    window.onload = () => {
      void (async () => {
        const fx = document.getElementById('fx');
        const pc_search_results = document.getElementById('pc_search_results');
        const pc_search_count = document.getElementById('pc_search_count');
        const pc_list = document.getElementById('pc_list');
        fx.onkeydown = async (t) => {
          if (t.key === 'Enter') {
            await search(t.target.value);
          }
        }

        search(fx.value);

        async function search(queue) {
          const [count, htm] = await fetch(\`/pre-render/pc?queue=\${queue}\`).then(x=>x.json());
          pc_search_count.innerText = count;
          pc_search_results.innerHTML = htm;
        }

        // load pc list
        const htm = await fetch('/pre-render/pc-list').then(x=>x.text());
        pc_list.innerHTML = htm;
      })();
    }
  </script>
</head>

<body>
  <h1>List of all 4W PCs</h1>
  <span class=meta>
    Search for PCs given queue
    <input size=7 id=fx class='mino uc'></input>
  </span>
  <br><span class=meta style='padding-left: 10px'><b id="pc_search_count">0</b> PCs found</span>
  <div id="pc_search_results"></div>
  <div id="pc_list"></div>
</body>

</html>`;

export const home = `<html>

<head>
  <link rel=stylesheet href='../../css'>
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#2c2d30">
  <meta property="og:title" content="qv">
  <meta property="og:url" content="/">
  <meta property="og:image" content="/render?grid=|g2et|get2|g3t&scale=7">
  <meta property="og:description" content="General resource for things related to 4-wide.">
  <title>qv</title>
  <style>
    .g {
      display: grid;
      gap: 1rem; /* Adjust spacing between grid items */
      grid-template-columns: repeat(auto-fit, minmax(0, 20vw));
      max-width: calc(3 * 1fr + 2 * 1rem); /* Limit width to 3 columns */
    }
    .item {
      display: grid;
      grid-template-columns: 80% 10%;
      margin: 0% 10% 10% 10%;
      box-sizing: border-box;
    }

    .u {
      color: white;
      text-decoration: underline dotted #999999;
    }

    .j {
      content-fit:contain;
    }
  </style>
</head>

<body>
  <h1>qv</h1>
  <span class=meta>created by <b>trueharuu</b> | <a style="color:#aaaaff" href="https://github.com/trueharuu/qv">source</a></span>

  <br><br>
  <div class=g>
  <div class=item>
    <div>
      <a class=u href='/list/ren/3'><h2>All 3-res patterns</h2></a>
      <span class=meta>List of all 3-residual combo patterns.</span>
    </div>
    <img class=j src='/render?grid=|e2l2|e3l|g3l&clear=true'>
  </div>
  <div class=item>
    <div>
      <a class=u href='/list/ren/4'><h2>All 4-res patterns</h2></a>
      <span class=meta>List of all 4-residual combo patterns.</span>
    </div>
    <img class=j src='/render?grid=|g|ges2|gs2g&clear=true'>
  </div>
  <div class=item>
    <div>
      <a class=u href='/list/ren/6'><h2>All 6-res patterns</h2></a>
      <span class=meta>List of all 6-residual combo patterns.</span>
    </div>
    <img class=j src='/render?grid=|ezg2|z2eg|zg3&clear=true'>
  </div>
  <div class=item>
    <div>
      <a class=u href='/tools/combo-finder'><h2>Combo Finder</h2></a>
      <span class=meta>Finds combo given a board and queue.</span>
    </div>
    <img class=j src='/render?grid=j|j3g|gege|g2eg&clear=true'>
  </div>
  <div class=item>
    <div>
      <a class=u href='/tools/pc-finder'><h2>PC Finder</h2></a>
      <span class=meta>Finds a PC given a board and queue.</span>
    </div>
    <img class=j src='/render?grid=z2s2|lz2j|ls2j|l2j2'>
  </div>
    <div class=item>
      <div>
        <a style='color:white' class=u href='/render?grid=oe2o||oe2o|o4'><h2>Board Renderer</h2></a>
          <span class=meta>Renders a Tetris board (<a href='/render/guide' class=u>guide</a>)</span>
      </div>
      <img class=j src=/render?grid=oe2o||oe2o|o4'>
    </div>
    <div class=item>
      <div>
        <a class=u href='/board'><h2>Board Editor</h2></a>
        <span class=meta>Visual board editor made by
					<a href='https://github.com/durocodes' class=u>duro</a>
				</span>
      </div>
      <img class=j src='/render?grid=ez3|z2i2|z4|ezez'>
    </div>
  </a>

  <div>

</body>

</html>`;

export const renderguide = `<html>

<head>
  <link rel=stylesheet href='../../css'>
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#2c2d30">
  <meta property="og:title" content="qv | render guide">
  <meta property="og:url" content="/render/guide">
  <meta property="og:image" content="/render?grid=oe2o||oe2o|o4">
  <meta property="og:description" content="Guide for making diagrams with the render tool.">
  <title>qv | render guide</title>

  <style>
    c {
      background-color: #2c2d30;
      padding: 3px;
      color: white;
      font-family: 'Source Code Pro';
      font-size: 13px;
    }

    .indent {
      margin-left: 2%;
    }

    .io {
      display: grid;
      grid-template-columns: 50% 50%;
      margin-bottom: 20%;
    }
  </style>
</head>

<body>
  <h1>qv render guide</h1>
  This is a largely uncompressed format. You can use the <c>I</c>, <c>J</c>, <c>O</c>, <c>L</c>, <c>Z</c>, <c>S</c>, <c>T</c>, <c>G</c>, <c>E</c>, and <c>D</c>, characters to draw singular blocks of their color.
  <br>The special characters, <c>G</c>, <c>E</c>, and <c>D</c>, represent garbage cells, empty cells, and darker garbage cells, respectively.

  <div class=indent>
  <br><br><br><img src='/render?grid=ijolzstged'><br><i class=meta>A rendered grid with input <c>IJOLZSTGED</c> is shown.</i><br><br>
  </div>

  You can have multiple lines by separating the rows with a vertical bar, <c>|</c>.
  You can also represent multiple consecutive cells that are the same color by putting a single digit after the cell color. <c>t3</c> would render 3 T cells in a row, for example.

  <div class=indent>
  <br><br><br><img src='/render?grid=le2z2es|le3z2s2o2|l2ei4so2'><br>
  <i class=meta>A rendered grid with input <c>le2z2es|le3z2s2o2|l2ei4so2</c> is shown.</i><br><br>
  </div>

  By specifying the <c>clear=true</c> parameter, you can choose to highlight line clears. This is disabled by default.

  <div class=indent>
  <br><br><br><img src='/render?grid=g2s2|gs2'> <img src='/render?grid=g2s2|gs2&clear=true'><br>
  <i class=meta>A rendered grid with input <c>g2s2|gs2</c> is shown, with and without the <c>clear</c> option set.</i><br><br>
  </div>

  The size of the resulting image can be changed with the <c>scale</c> parameter. By default, it is set to <c>4</c>.

  <div class=indent>
  <br><br><br><img src='/render?grid=et|t3'> <img src='/render?grid=et|t3&scale=6'><br>
  <i class=meta>A rendered grid with input <c>et|t3</c> is shown, with and without the <c>scale=6</c> option set.</i><br><br>
  </div>

  <h2>Playground</h2>
  <div class=io>
    <div>
      <h3>Input</h3>
      <input id=i placeholder='some grid...' value=oe2o||oe2o|o4></input>
      <br><br>
      <input id=c type=checkbox>Line Clears</input>
      <input id=m type=checkbox>Mirror</input>
      <br>
      <input size=2 value=4 placeholder=4 id=s type=number>x Scale </input>
    </div>
    <div>
      <h3>Output</h3>
        <img id=o>
        <br>
        <button id=cpyu>Copy URL</button>
    </div>
  </div>

  <script>
    const i = document.getElementById('i');
    const c = document.getElementById('c');
    const s = document.getElementById('s');
    const o = document.getElementById('o');
    const m = document.getElementById('m');
    // const cpy = document.getElementById('cpy');
    const cpyu = document.getElementById('cpyu');

    function uri() {
      return \`\${window.location.origin}/render.gif?grid=\${i.value}&scale=\${s.value}&clear=\${c.checked}&mirror=\${m.checked}\`;
    }

    function update(z) {
      o.src = uri();
    }

    function copy_url(z) {
        const type = 'text/plain';
        const text = uri();
        const blob = new Blob([text], { type });
        const data = [new ClipboardItem({ [type]: blob })];
        navigator.clipboard.write(data);
    }

    async function copy_image(z) {
        const type = 'image/png';
        const r = await fetch(uri());
        const text = await r.blob();
        const data = [new ClipboardItem({ [type]: text })];
        navigator.clipboard.write(data);
    }

    update();
    i.onkeyup = update;
    c.onchange = update;
    m.onchange = update;
    s.onkeyup = update;
    cpyu.onclick = copy_url;
    // cpy.onclick = copy_image;
  </script>
</body>

</html>`;

export const board_editor = (g: string) => `<html>
<head>
  <link rel=stylesheet href='../../css'>
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#2c2d30">
  <meta property="og:title" content="qv | board editor">
  <meta property="og:url" content="/edit">
  <meta property="twitter:image" content="/render.gif?grid=${g}">
  <meta property="twitter:card" content="summary_large_image">
  <title>qv | edit</title>
  <style>
    table {
      border-collapse: collapse;
      margin: 0;
      border-spacing: 0;
			color: rgba(255, 255, 255, 0.2);
      table-layout: fixed; /* Keep cells as squares */
    }

    td {
      aspect-ratio: 1;
      width: 40px;
      min-width: 40px;
      max-width: 40px;
      padding: 0;
      line-height: 40px;
      border: 1px solid #444;
      text-align: center;
      cursor: pointer;
      background: var(--e);
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    }

    .controls {
      margin: 20px;
    }

    .preview {
      display: grid;
      grid-template-columns: 50% 50%;
      margin-bottom: 20px;
    }

    .preview-section {
      padding: 10px;
    }

    .piece-selector {
      display: inline-block;
      margin-right: 10px;
    }

    .piece-selector span {
      padding: 5px 10px;
      cursor: pointer;
      border: 1px solid transparent;
      width: 20px;
      height: 20px;
      display: inline-block;
      margin: 0 5px;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
    }

    .piece-selector span.selected {
      border-color: white;
      color: rgba(255, 255, 255, 0.8);
    }

    #output {
      font-family: 'Source Code Pro';
      background: #2c2d30;
      border: none;
      color: white;
      padding: 10px;
      width: 100%;
      min-height: 50px;
      resize: vertical;
      box-sizing: border-box;
    }

    .render-options {
      margin: 10px 0;
      display: grid;
      gap: 8px;
    }

    .render-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .editor-layout {
      display: grid;
      grid-template-columns: auto 400px;
      gap: 20px;
      margin: 20px;
    }

    .board-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: flex-start;
    }

    .board-controls {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 15px;
    }

    .page-controls {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
    }

    .preview-panel {
      background: #1c1d1f;
      padding: 20px;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .page-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .fumen-input {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    #fumen {
      flex: 1;
    }

    h3 {
      margin: 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #333;
    }

		button {
      background: #2c2d30;
      border: 1px solid #444;
      color: #fff;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    button:hover {
      background: #3c3d40;
      border-color: #555;
    }

    button:active {
      background: #1c1d20;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

		button:disabled:hover {
			background: #2c2d30;
			border-color: #444;
		}

    .danger {
      color: #ff6b6b;
      border-color: #ff6b6b;
    }

    .danger:hover {
      background: rgba(255, 107, 107, 0.1);
      border-color: #ff6b6b;
    }

		.danger:disabled:hover {
			background: #2c2d30;
      border-color: #ff6b6b;
		}

    .warn {
      color: #ffff6b;
      border-color: #ffff6b;
    }

    .warn:hover {
      background: rgba(255, 255, 107, 0.1);
      border-color: #ffff6b;
    }
  </style>
</head>
<body>
  <h1>Board Editor</h1>
  <span class="meta">Click cells to place pieces. You can also use keyboard shortcuts.</span>

  <div class="editor-layout">
    <div class="board-section">
      <div class="page-controls">
        <button id="prevPage">&lt;</button>
        <span id="pageInfo" class="meta">Page 1/1</span>
        <button id="nextPage">&gt;</button>
        <button id="newPage">&plus;</button>
        <button id="removePage" class=danger onclick="removePage()">Remove Page</button>
      </div>

      <div class="board-controls">
        <div class="piece-selector">
          <span class="selected" style="background:var(--e)" data-piece="E">E</span>
          <span style="background:var(--i)" data-piece="I">I</span>
          <span style="background:var(--j)" data-piece="J">J</span>
          <span style="background:var(--l)" data-piece="L">L</span>
          <span style="background:var(--o)" data-piece="O">O</span>
          <span style="background:var(--s)" data-piece="S">S</span>
          <span style="background:var(--z)" data-piece="Z">Z</span>
          <span style="background:var(--t)" data-piece="T">T</span>
          <span style="background:var(--g)" data-piece="G">G</span>
          <span style="background:var(--d)" data-piece="D">D</span>
        </div>
        <div>
          <button id="edit-mirror">Mirror</button>
          <button id="edit-to-gray">To Gray</button>
          <button id="edit-only-gray">Only Gray</button>
          <button id="edit-skim">Skim</button>
          <button id="edit-clear" class=danger>Clear</button>
          
          <button id="edit-undo" class=warn>Undo</button>
          <button id="edit-redo" class=warn>Redo</button>
        </div>
        
        <div>
          <label>Size: </label>
          <input type="number" id="cols" value="10" min="0" style="width:50px"> &times;
          <input type="number" id="rows" value="4" min="0" style="width:50px">
        </div>
      </div>

      <table id="board"></table>
      <span><a id="vtotal">[view]</a> <a id="vpage">[view page]</a></span>
    </div>

    <div class="preview-panel">
      <div>
        <h3>Text Representation</h3>
        <textarea id="output" spellcheck="false"></textarea>
        <div style="display:flex;gap:10px;margin:10px 0">
          <button onclick="copyOutput()">Copy Text</button>
          <button onclick="copyFumen()">Copy Fumen</button>
          <button onclick="importText(false)">Import Text</button>
        </div>
        <div class="fumen-input">
          <label>Import Fumen:</label>
          <input id="fumen">
          <button onclick="importFumen()">Import</button>
        </div>
      </div>

      <div>
        <h3>Preview</h3>
        <div class="render-options">
          <div class="render-option">
            <label>Animation Delay:</label>
            <input type="number" id="delay" value="500" min="0" style="width:80px"> ms
          </div>
          <div class="render-option">
            <input type="checkbox" id="clear" checked>
            <label for="clear">Show Line Clears</label>
          </div>
          <div class="render-option">
            <input type="checkbox" id="loop" checked>
            <label for="loop">Loop Animation</label>
          </div>
        </div>
        <div>
          <img id="preview" style="max-width:100%">
					<br>
          <button onclick="copyPreviewUrl()">Copy Image URL</button>
          <button onclick="copyPageUrl()">Copy URL</button>
        </div>
      </div>
    </div>

    
  </div>

  <script>
		let isDrawing = false;
		let currentDragPiece = null;
		let isDragDeleting = false;
		const preview = document.getElementById('preview');
		const rowsInput = document.getElementById('rows');
		const colsInput = document.getElementById('cols');
		let ROWS = rowsInput.value || 4;
		let COLS = colsInput.value || 10;
		const delay = document.getElementById('delay');
		let selectedPiece = 'E';
		let currentPage = 0;
		let pages = [''];
    const vtotal = document.getElementById('vtotal');
    const vpage = document.getElementById('vpage');


		const undoStack = [];
		const redoStack = [];

		function saveState() {
			undoStack.push(JSON.stringify({
				pages,
				currentPage,
				ROWS,
				COLS
			}));
			redoStack.length = 0; // clear redo when new state is saved
		}

		function undo() {
			if (undoStack.length === 0) return;
			const state = JSON.parse(undoStack.pop());
			redoStack.push(JSON.stringify({
				pages,
				currentPage,
				ROWS,
				COLS
			}));

			pages = state.pages;
			currentPage = state.currentPage;
			ROWS = state.ROWS;
			COLS = state.COLS;
			rowsInput.value = ROWS;
			colsInput.value = COLS;
			importPage();
		}
    
		function redo() {
			if (redoStack.length === 0) return;
			const state = JSON.parse(redoStack.pop());
			undoStack.push(JSON.stringify({
				pages,
				currentPage,
				ROWS,
				COLS
			}));

			pages = state.pages;
			currentPage = state.currentPage;
			ROWS = state.ROWS;
			COLS = state.COLS;
			rowsInput.value = ROWS;
			colsInput.value = COLS;
			importPage();
		}

		document.addEventListener('keydown', (e) => {
			if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

			const key = e.key.toUpperCase();
			if (e.ctrlKey && key === 'Z') {
				e.preventDefault();
				if (e.shiftKey) {
					redo();
				} else {
					undo();
				}
			} else if (e.ctrlKey && key === 'Y') {
				e.preventDefault();
				redo();
			} else if (!e.ctrlKey && 'IJLOSZGTED'.includes(key)) {
				const pieceElement = document.querySelector(\`[data-piece="\${key}"]\`);
				if (pieceElement) {
					document.querySelector('.piece-selector .selected').classList.remove('selected');
					pieceElement.classList.add('selected');
					selectedPiece = key;
				}
			} else if (e.ctrlKey && key === 'C') {
				copyOutput();
			} else if (e.ctrlKey && key === 'V') {
				pasteOutput();
			}
		});

		function initializeBoard() {
			const oldState = [];
			if (board.rows.length > 0) {
				for (let i = 0; i < board.rows.length; i++) {
					oldState[i] = [];
					for (let j = 0; j < board.rows[i].cells.length; j++) {
						oldState[i][j] = board.rows[i].cells[j].textContent;
					}
				}
			}

			board.innerHTML = '';
			for (let i = 0; i < ROWS; i++) {
				const row = board.insertRow();
				for (let j = 0; j < COLS; j++) {
					const cell = row.insertCell();
					cell.textContent = oldState[i] && oldState[i][j] ? oldState[i][j] : 'E';
					cell.style.background = \`var(--\${cell.textContent.toLowerCase()})\`;

					cell.addEventListener('mousedown', () => {
						isDrawing = true;
						updateCell(cell);
					});

					cell.addEventListener('mouseover', () => {
						if (isDrawing) {
							updateCell(cell, false);
						}
					});

					cell.addEventListener('touchstart', (e) => {
						e.preventDefault();
						isDrawing = true;
						updateCell(cell);
					});

					cell.addEventListener('touchmove', (e) => {
						e.preventDefault();
						if (isDrawing) {
							const touch = e.touches[0];
							const target = document.elementFromPoint(touch.clientX, touch.clientY);
							if (target && target.tagName === 'TD') {
								updateCell(target, false);
							}
						}
					});
				}
			}
			updateOutput(false);
		}

		document.addEventListener('mouseup', () => {
			isDrawing = false;
			currentDragPiece = null;
			isDragDeleting = false;
		});

		document.addEventListener('touchend', () => {
			isDrawing = false;
			currentDragPiece = null;
			isDragDeleting = false;
		});

		board.addEventListener('touchmove', (e) => {
			if (isDrawing) {
				e.preventDefault();
			}
		}, { passive: false });

		function handleResize() {
			saveState();
			const newRows = Math.max(1, parseInt(rowsInput.value) || 4);
			const newCols = Math.max(1, parseInt(colsInput.value) || 4);

			if (newRows !== ROWS || newCols !== COLS) {
				ROWS = newRows;
				COLS = newCols;
				initializeBoard();
			}
		}

		rowsInput.addEventListener('keyup', handleResize);
		rowsInput.addEventListener('change', handleResize);
		colsInput.addEventListener('keyup', handleResize);
		colsInput.addEventListener('change', handleResize);

		function scrollResize(e, input, min = 0, step = 1) {
			e.preventDefault();
			const delta = e.deltaY < 0 ? step : -step;
			input.value = Math.max(min, parseInt(input.value) + delta).toString();
			if (input === delay) {
				updatePreview();
			} else {
				handleResize();
			}
		}

		rowsInput.addEventListener('wheel', (e) => scrollResize(e, rowsInput, 1));
		colsInput.addEventListener('wheel', (e) => scrollResize(e, colsInput, 1));
		delay.addEventListener('wheel', (e) => scrollResize(e, delay, 0, 49));

		initializeBoard();

		document.querySelectorAll('.piece-selector span').forEach(span => {
			span.onclick = () => {
				document.querySelector('.piece-selector .selected').classList.remove('selected');
				span.classList.add('selected');
				selectedPiece = span.dataset.piece;
			}
		});

		function updateCell(cell, force = true) {
			saveState();
			if (force) {
				// Initial click
				if (cell.textContent === selectedPiece) {
					// Start deleting if clicking our piece
					cell.textContent = 'E';
					cell.style.background = 'var(--e)';
					currentDragPiece = null;
					isDragDeleting = true;
				} else {
					// Start placing if clicking empty or different piece
					cell.textContent = selectedPiece;
					cell.style.background = \`var(--\${selectedPiece.toLowerCase()})\`;
					currentDragPiece = selectedPiece;
					isDragDeleting = false;
				}
			} else if (isDragDeleting) {
				// During delete drag - only remove our selected piece
				if (cell.textContent === selectedPiece) {
					cell.textContent = 'E';
					cell.style.background = 'var(--e)';
				}
			} else if (currentDragPiece) {
				// During place drag - place on any cell except where same piece already exists
				if (cell.textContent !== currentDragPiece) {
					cell.textContent = currentDragPiece;
					cell.style.background = \`var(--\${currentDragPiece.toLowerCase()})\`;
				}
			}
			updateOutput();
		}

    document.getElementById('edit-clear').onclick = () => {
			saveState();
			document.querySelectorAll('td').forEach(cell => {
				cell.textContent = 'E';
				cell.style.background = 'var(--e)';
			});
			updateOutput();
		}

    document.getElementById('edit-mirror').onclick = () => {
      saveState();
      const r = expandString(pages[currentPage]).split('|');
      for (let i = 0; i < r.length; i++) {
        r[i] = r[i].split('').reverse().map(x=>({J:'L',L:'J',Z:'S',S:'Z'})[x] || x).join('');
      }

      pages[currentPage] = r.join('|');
      importPage();
      updateOutput();
    }

    document.getElementById('edit-to-gray').onclick = () => {
      saveState();
      const r = expandString(pages[currentPage]).split('|');
      for (let i = 0; i < r.length; i++) {
        r[i] = r[i].split('').map(x => x === 'E' ? 'E' : 'G').join('');
      }

      pages[currentPage] = r.join('|');
      importPage();
      updateOutput();
    }

    document.getElementById('edit-only-gray').onclick = () => {
      saveState();
      const r = expandString(pages[currentPage]).split('|');
      for (let i = 0; i < r.length; i++) {
        r[i] = r[i].split('').map(x => x === 'G' ? 'G' : 'E').join('');
      }

      pages[currentPage] = r.join('|');
      importPage();
      updateOutput();
    }

    document.getElementById('edit-undo').onclick = () => {
      undo();
    }

    document.getElementById('edit-redo').onclick = () => {
      redo();
    }

    document.getElementById('edit-skim').onclick = () => {
      saveState();
      const r = expandString(pages[currentPage]).split('|');
      const removed_lines = r.filter(x => !x.includes('E')).length;
      const t = [...Array(removed_lines).fill('E'.repeat(r[0].length)), ...r.filter(x => x.includes('E'))]

      pages[currentPage] = t.join('|');
      importPage();
      updateOutput();
    }

		function updateOutput(update = true) {
			const grid = [];
			for (let i = 0; i < ROWS; i++) {
				const row = [];
				for (let j = 0; j < COLS; j++) {
					row.push(board.rows[i].cells[j].textContent);
				}
				let optimizedRow = '';
				let count = 1;
				for (let k = 0; k < row.length; k++) {
					if (k < row.length - 1 && row[k] === row[k + 1]) {
						count++;
					} else {
						optimizedRow += count > 1 ? row[k] + count : row[k];
						count = 1;
					}
				}
				grid.push(optimizedRow);
			}
			const gridString = grid.join('|');
			pages[currentPage] = gridString;
			// console.log(update);
			if (update) {
				output.value = pages.join(';');
        // console.log(window.location);
        const t = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + output.value;
        // console.log(t);
        window.history.replaceState(null, '', t);
			}

      updatePreview();
      vtotal.href = '/view?' + pages.join(';');
      vpage.href = '/view?' + gridString;
      
		}

		function updatePreview() {
			const delayMs = parseInt(delay.value) || 500;
			const showClears = document.getElementById('clear').checked;
			const shouldLoop = document.getElementById('loop').checked;
			preview.src = \`/render.gif?grid=\${pages.join(';')}&delay=\${delayMs}&clear=\${showClears}&loop=\${shouldLoop}\`;
			document.getElementById('pageInfo').textContent = \`Page \${currentPage + 1}/\${pages.length}\`;
			document.getElementById('prevPage').disabled = currentPage === 0;
			document.getElementById('nextPage').disabled = currentPage === pages.length - 1;
			document.getElementById('removePage').disabled = pages.length <= 1;
		}

		function expandString(input) {
			const regex = /(?:\\[(\\w+)\\]|(\\w))(\\d*)/g;
			const i = input.replaceAll(regex, ($, $1, $2, $3) => ($1 || $2).repeat(Number($3 || '1')));
			// console.log(i);
			// console.log(input, i);
			if (input === i) {
				return i;
			}

			return expandString(i);
		}
		// console.log(expandString('E2'));

		function importPage(update = true) {
			// console.log(1);
			const currentGrid = pages[currentPage] || 'E'.repeat(COLS).repeat(ROWS);
			const rows = currentGrid.split('|').map(x=>expandString(x));
			// console.log("rows", rows);

			const prevRows = ROWS;
			const prevCols = COLS;

			ROWS = rows.length || prevRows;
			COLS = Math.max(...rows.map(r => {
				let len = 0;
				for (let i = 0; i < r.length; i++) {
					const num = parseInt(r[i + 1]);
					if (!isNaN(num)) {
						len += num - 1;
						i++;
					}
					len++;
				}
				return len;
			})) || prevCols;

			rowsInput.value = ROWS;
			colsInput.value = COLS;
			initializeBoard();

			document.querySelectorAll('td').forEach(cell => {
				cell.textContent = 'E';
				cell.style.background = 'var(--e)';
			});

			rows.forEach((row, i) => {
				let col = 0;
				for (let j = 0; j < row.length; j++) {
					if (i >= board.rows.length || col >= board.rows[i].cells.length) continue;

					const cell = board.rows[i].cells[col];
					const char = row[j].toUpperCase();
					const num = parseInt(row[j + 1]);

					if (!isNaN(num)) {
						for (let k = 0; k < num && (col + k) < board.rows[i].cells.length; k++) {
							board.rows[i].cells[col + k].textContent = char;
							board.rows[i].cells[col + k].style.background = \`var(--\${char.toLowerCase()})\`;
						}
						col += num;
						j++;
					} else if ('IJLOSZDGTE'.includes(char)) {
						cell.textContent = char;
						cell.style.background = \`var(--\${char.toLowerCase()})\`;
						col++;
					}
				}
			});

			updateOutput(update);
		}

		document.getElementById('prevPage').onclick = () => {
			if (currentPage > 0) {
				currentPage--;
				importPage();
			}
		};

		function createEmptyBoard() {
			const emptyRows = [];
			for (let i = 0; i < ROWS; i++) {
				emptyRows.push('E'.repeat(COLS));
			}
			return emptyRows.join('|');
		}

		document.getElementById('nextPage').onclick = () => {
			if (currentPage !== pages.length - 1) {
				currentPage++;
				importPage();
			}
		};

		document.getElementById('newPage').onclick = () => {
			currentPage = pages.length - 1;
			importPage();
			// console.log(pages);
			pages.push(pages[currentPage]);
			currentPage++;
			importPage();
		};

		function removePage() {
			if (pages.length > 1) {
				pages.splice(currentPage, 1);
				currentPage = Math.max(0, currentPage - 1);
				importPage();
			}
		}

		function importText(update = true) {
			saveState();
			const text = expandString(output.value);
			pages = text.split(';');
			currentPage = 0;
			// console.log(pages);
			importPage(update);
		}

		output.addEventListener('keyup', () => {
			importText(false);
		});

		function copyOutput() {
			output.select();
			document.execCommand('copy');
		}

		function pasteOutput() {
			output.select();
			document.execCommand('paste');
		}

		async function copyFumen() {
			fetch(\`/convert?data=\${output.value}\`).then(r=>r.text()).then(r=>navigator.clipboard.writeText(r));
		}

		function copyPreviewUrl() {
			const text = preview.src;
			navigator.clipboard.writeText(text);
		}

    function copyPageUrl() {
			const text = window.location.href;
			navigator.clipboard.writeText(text);
		}

		function importFumen() {
			saveState();
			const fumenText = document.getElementById('fumen').value;
			if (!fumenText) return;

			fetch(\`/convert?data=\${encodeURIComponent(fumenText)}\`)
				.then(r => r.text())
				.then(grid => {
					pages = grid.split(';');
					currentPage = 0;
					importPage();
				});
		}

		delay.addEventListener('input', updatePreview);

		delay.addEventListener('wheel', (e) => scrollResize(e, delay, 50));

		document.getElementById('clear').addEventListener('change', updatePreview);
		document.getElementById('loop').addEventListener('change', updatePreview);

		updateOutput(false);
        const predata = window.location.search.slice(1);

    if (predata) {
      if (/^v\\d+@/.test(predata)) {
        // console.log(predata);
        document.getElementById('fumen').value = predata;
        importFumen();
      } else {
        output.value = predata;
        importText(false);
      }
    }
  </script>
</body>

</html>`;

export const view = (f: Pages) => {
	// let txt = '';
	// let i = 0;
	let pgs = f.map(
		(x) =>
			[
				fumenToGrid(encoder.encode([x]), false)
					.split('|')
					.map((x) => x.split('')),
				x.comment,
			] as const
	);


	return `<html>

<head>
  <link rel=stylesheet href='../../css'>
    <meta property="og:type" content="website">
  <meta name="theme-color" content="#2c2d30">
  <meta property="og:title" content="qv">
  <meta property="og:title" content="Render of ${pgs.length} page${pgs.length === 1 ? '' : 's'}">
  <meta property="og:url" content="/view">
  <meta property="twitter:image" content="/render.gif?grid=${pgs.map((x) => x[0].map((x) => x.join('')).join('|')).join(';')}">
  <meta property="twitter:card" content="summary_large_image">
  <title>qv | view</title>
  <style>
    body {
      margin-left: 2%;
      margin-right: 2%;
      margin-top: 2%;
    }
    .frame {
      display: inline-block;
      background-color: #1e1e1e;
      margin: 0.5%;
      padding: 1%;
      text-align: center;
      border-radius: 5px;
    }
  </style>
</head>

<body>
  Viewing <input id='currently-viewing' style='width:90%' type=text></input><br><br>
  <div id=load></div>
  <br><br>
  <span class=meta>Showing <b id=pages></b> pages</span> <a href='/edit?${encoder.encode(f)}'>[edit]</a>
  <script>
    let current = document.getElementById('currently-viewing');
    let pageCount = document.getElementById('pages');
    current.value = location.search.slice(1);

    		function expandString(input) {
			const regex = /(?:\\[(\\w+)\\]|(\\w))(\\d*)/g;
			const i = input.replaceAll(regex, ($, $1, $2, $3) => ($1 || $2).repeat(Number($3 || '1')));
			// console.log(i);
			// console.log(input, i);
			if (input === i) {
				return i;
			}

			return expandString(i);
		}

    current.onkeyup = () => {
            const t = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + current.value;
            window.history.replaceState(null, '', t);
            update();
    }

    const load = document.getElementById('load');
    async function update() {
      let v = current.value;
      let d = await fetch('./decode?data='+encodeURIComponent(v)).then(x=>x.json());

      // console.log(d);
      const frames = d.map(x=>x.data.split('|').map(x=>expandString(x)));
      pageCount.innerText = frames.length;
      let txt = '';
      const mh = frames.map(x=>x.length).reduce((x,y)=>Math.max(x,y));
      const mw = frames.map(x=>Math.max(...x.map(y=>y.length))).reduce((x,y)=>Math.max(x,y));
      // console.log(mw);
      let i = 0;
      let has_comments = d.some(x=>x.comment !== '');
      for (let frame of frames) {
        while (frame.length < mh) {
          frame.unshift(Array(mw).fill('E').join(''));
        }

        for (let j = 0; j < frame.length; j++) {
          while (frame[j].length < mw) {
            frame[j] += 'E';
          }
        }
          
        txt += \`<div class=frame><img src='/render?grid=\${frame.join('|')}'><br><span class=meta>\${has_comments ? '&nbsp;'+(d[i].comment || '<i>empty</i>') : ''}</span></div>\`;
        i++;
      }
      load.innerHTML = txt;
    }

    update();
  </script>
</body>

</html>`;
};
