// Todo download do EVA Leads é pela Microsoft Store: verificado pela Microsoft,
// sem aviso de segurança do Windows e com atualização automática. Os endereços
// antigos de download direto (/baixar e /EVA-Leads-instalador.exe), que podem
// estar em mensagens e links salvos, levam para a página da Store. O resto são
// as páginas estáticas (index.html), servidas pelo próprio Cloudflare.
//
// O instalador continua no Release do GitHub só para o programa de quem já
// instalou por ele se atualizar sozinho (atualizacoes.json).
//
// /ir/<canal> (google, instagram, ...): a Store com a marca da campanha
// (cid). O Partner Center mostra visitas e instalações por campanha: é assim
// que se sabe qual anúncio trouxe cada cliente. A página dos anúncios
// (/comecar?c=<canal>) usa esses links.
const STORE = "https://apps.microsoft.com/detail/9PFHQKHCTHXW?hl=pt-BR&gl=BR";
const ROTAS = new Set(["/baixar", "/EVA-Leads-instalador.exe"]);
const CANAL = /^\/ir\/([a-z0-9-]{1,30})\/?$/;

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const canal = CANAL.exec(pathname);
    if (canal) return Response.redirect(`${STORE}&cid=${canal[1]}`, 302);
    if (!ROTAS.has(pathname)) return env.ASSETS.fetch(request);
    return Response.redirect(STORE, 302);
  },
};
