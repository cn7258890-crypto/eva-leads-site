// Download do instalador pelo endereço do próprio site (/baixar).
// O arquivo continua guardado no Release do GitHub (o mesmo que o programa usa
// para se atualizar), mas o cliente baixa daqui: o navegador mostra o site
// como origem e o nome "EVA-Leads-instalador.exe". O resto são as páginas
// estáticas (index.html), servidas pelo próprio Cloudflare.
const INSTALADOR =
  "https://github.com/cn7258890-crypto/eva-leads-site/releases/latest/download/EVA-Leads-instalador.exe";
const ROTAS = new Set(["/baixar", "/EVA-Leads-instalador.exe"]);

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (!ROTAS.has(pathname)) return env.ASSETS.fetch(request);
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Método não permitido", { status: 405, headers: { Allow: "GET, HEAD" } });
    }
    let origem;
    try {
      origem = await fetch(INSTALADOR, { method: request.method, redirect: "follow" });
    } catch {
      origem = null;
    }
    // Se o GitHub falhar daqui, o navegador baixa direto de lá: o download nunca para.
    if (!origem || !origem.ok) return Response.redirect(INSTALADOR, 302);

    const cabecalhos = new Headers({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="EVA-Leads-instalador.exe"',
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    const tamanho = Number(origem.headers.get("Content-Length")) || 0;
    if (tamanho) cabecalhos.set("Content-Length", String(tamanho));
    if (request.method === "HEAD" || !origem.body) return new Response(null, { status: 200, headers: cabecalhos });
    // Com o tamanho conhecido, o navegador mostra o andamento ("12 de 43 MB").
    let corpo = origem.body;
    if (tamanho) {
      const { readable, writable } = new FixedLengthStream(tamanho);
      origem.body.pipeTo(writable).catch(() => {});
      corpo = readable;
    }
    return new Response(corpo, { status: 200, headers: cabecalhos });
  },
};
