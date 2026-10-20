// Todo download do EVA Leads é pela Microsoft Store: verificado pela Microsoft,
// sem aviso de segurança do Windows e com atualização automática. Os endereços
// antigos de download direto (/baixar e /EVA-Leads-instalador.exe), que podem
// estar em mensagens e links salvos, levam para a página da Store. O resto são
// as páginas estáticas (index.html), servidas pelo próprio Cloudflare.
//
// O instalador continua no Release do GitHub só para o programa de quem já
// instalou por ele se atualizar sozinho (atualizacoes.json).
const STORE = "https://apps.microsoft.com/detail/9PFHQKHCTHXW?hl=pt-BR&gl=BR";
const ROTAS = new Set(["/baixar", "/EVA-Leads-instalador.exe"]);

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (!ROTAS.has(pathname)) return env.ASSETS.fetch(request);
    return Response.redirect(STORE, 302);
  },
};
