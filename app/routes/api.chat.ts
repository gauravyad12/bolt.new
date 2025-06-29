import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { MAX_RESPONSE_SEGMENTS, MAX_TOKENS } from '~/lib/.server/llm/constants';
import { CONTINUE_PROMPT } from '~/lib/.server/llm/prompts';
import { streamText, type Messages, type StreamingOptions } from '~/lib/.server/llm/stream-text';
import SwitchableStream from '~/lib/.server/llm/switchable-stream';
import type { AIProvider } from '~/types/ai';
import type { ChatMode } from '~/lib/stores/chat';

export async function action(args: ActionFunctionArgs) {
  return chatAction(args);
}

async function chatAction({ context, request }: ActionFunctionArgs) {
  const { 
    messages, 
    provider = 'anthropic', 
    apiKey, 
    baseUrl, 
    modelId,
    mode = 'agent'
  } = await request.json<{ 
    messages: Messages;
    provider?: AIProvider;
    apiKey?: string;
    baseUrl?: string;
    modelId?: string;
    mode?: ChatMode;
  }>();

  // Use environment API key as fallback
  const finalApiKey = apiKey || getAPIKeyFromEnv(provider, context.cloudflare.env);
  
  if (!finalApiKey) {
    throw new Response('API key not provided', { status: 400 });
  }

  const stream = new SwitchableStream();

  try {
    const options: StreamingOptions = {
      toolChoice: 'none',
      onFinish: async ({ text: content, finishReason }) => {
        if (finishReason !== 'length') {
          return stream.close();
        }

        if (stream.switches >= MAX_RESPONSE_SEGMENTS) {
          throw Error('Cannot continue message: Maximum segments reached');
        }

        const switchesLeft = MAX_RESPONSE_SEGMENTS - stream.switches;

        console.log(`Reached max token limit (${MAX_TOKENS}): Continuing message (${switchesLeft} switches left)`);

        messages.push({ role: 'assistant', content });
        messages.push({ role: 'user', content: CONTINUE_PROMPT });

        const result = await streamText({
          messages,
          env: context.cloudflare.env,
          provider,
          apiKey: finalApiKey,
          baseUrl,
          modelId,
          mode,
          options,
        });

        return stream.switchSource(result.toAIStream());
      },
    };

    const result = await streamText({
      messages,
      env: context.cloudflare.env,
      provider,
      apiKey: finalApiKey,
      baseUrl,
      modelId,
      mode,
      options,
    });

    stream.switchSource(result.toAIStream());

    return new Response(stream.readable, {
      status: 200,
      headers: {
        contentType: 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.log(error);

    throw new Response(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}

function getAPIKeyFromEnv(provider: AIProvider, env: Env): string | undefined {
  switch (provider) {
    case 'anthropic':
      return env.ANTHROPIC_API_KEY;
    case 'openai':
      return env.OPENAI_API_KEY;
    case 'gemini':
      return env.GOOGLE_API_KEY;
    case 'groq':
      return env.GROQ_API_KEY;
    case 'grok':
      return env.GROK_API_KEY;
    case 'huggingface':
      return env.HUGGINGFACE_API_KEY;
    case 'openrouter':
      return env.OPENROUTER_API_KEY;
    case 'together':
      return env.TOGETHER_API_KEY;
    case 'deepseek':
      return env.DEEPSEEK_API_KEY;
    case 'mistral':
      return env.MISTRAL_API_KEY;
    default:
      return undefined;
  }
}