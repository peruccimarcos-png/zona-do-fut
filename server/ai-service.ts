/**
 * Serviço de geração de conteúdo com IA (Groq)
 */

interface GenerateArticleParams {
  title: string;
  category: string;
  keywords?: string;
}

interface GenerateArticleResult {
  content: string;
  excerpt: string;
}

/**
 * Gera conteúdo de artigo usando IA (Groq/Llama)
 */
export async function generateArticleContent(
  params: GenerateArticleParams
): Promise<GenerateArticleResult> {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY não configurada');
  }

  const prompt = `Você é um jornalista esportivo especializado em futebol brasileiro e internacional.

Escreva uma análise completa e profissional sobre: "${params.title}"

Categoria: ${params.category}
${params.keywords ? `Palavras-chave: ${params.keywords}` : ''}

INSTRUÇÕES:
- Escreva em português brasileiro
- Use tom profissional mas acessível
- Mínimo de 500 palavras
- Divida em parágrafos bem estruturados
- Inclua análise técnica e contexto
- Use markdown para formatação (negrito, listas, etc.)
- NÃO invente fatos ou estatísticas - seja genérico se não tiver dados
- Foque em análise, opinião e contexto

Escreva APENAS o conteúdo do artigo, sem título (ele já foi fornecido).`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Você é um jornalista esportivo profissional especializado em futebol.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro na API Groq: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    if (!content) {
      throw new Error('IA não retornou conteúdo');
    }

    // Gerar excerpt (primeiras 2-3 frases)
    const sentences = content.split(/[.!?]\s+/);
    const excerpt = sentences.slice(0, 2).join('. ') + '.';

    return {
      content: content.trim(),
      excerpt: excerpt.trim()
    };
  } catch (error) {
    console.error('Erro ao gerar conteúdo com IA:', error);
    throw error;
  }
}

/**
 * Gera um slug único a partir do título
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-|-$/g, ''); // Remove hífens no início/fim
}
