export const combo_finder = `<html>

<head>
  <link rel=stylesheet href='../../css'>
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#2c2d30">
  <meta property="og:title" content="qv | combo finder">
  <meta property="og:url" content="/tools/combo-finder">
  <meta property="og:image" content="/render?grid=j|j3g|gege|g2eg&clear=true">
  <meta property="og:description" content="Finds combo given a board and queue.">
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
        if (t.key === 'Enter') {
          await search(rx.value, px.value, fx.value, hx.value);
        }
      }

      fx.onkeydown = go;
      hx.onkeydown = go;
      rx.onkeydown = go;
      px.onkeydown = go;

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
      <br>
      <input size=2 value=4 placeholder=4 id=s type=number>x Scale </input>
    </div>
    <div>
      <h3>Output</h3>
        <img id=o>
    </div>
  </div>

  <script>
    const i = document.getElementById('i');
    const c = document.getElementById('c');
    const s = document.getElementById('s');
    const o = document.getElementById('o');

    function update(z) {
      o.src = \`/render?grid=\${i.value}&scale=\${s.value}&clear=\${c.checked}\`;
    }

    update();
    i.onkeyup = update;
    c.onchange = update;
    s.onkeyup = update;
  </script>
</body>

</html>`;
