export const combo_finder = `<html>

<head>
  <link rel=stylesheet href='../../css'>
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
    <input size=7 id=fx class=mino>
    </input> and <input size=1 id=hx class=mino maxlength=1> in hold
    with <input size=1 id=rx type=number value=3> residuals
    on pattern <input size=2 id=px style="text-transform: uppercase;" value=1>
  </span>

  <br><br>
  <div id="results"></div>

</body>

</html>`;

export const pc_finder = `<html>

<head>
  <link rel=stylesheet href='../../css'>
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
    <input size=7 id=fx class=mino
      style='text-transform:uppercase;caret-color: var(--meta);outline:none;background-color:var(--bg);border:0px solid var(--meta);color:white;width:fit-content;border-bottom-width:1px;'>
    </input>
  </span>
  <br><span class=meta style='padding-left: 10px'><b id="pc_search_count">0</b> PCs found</span>
  <div id="pc_search_results"></div>
  <div id="pc_list"></div>
</body>

</html>`