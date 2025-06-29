import { json, type MetaFunction, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import { AuthWrapper } from '~/components/auth/AuthWrapper';

export const meta: MetaFunction = () => {
  return [{ title: 'Bolt' }, { name: 'description', content: 'Talk with Bolt, an AI assistant from StackBlitz' }];
};

export const loader = ({ context }: LoaderFunctionArgs) => {
  return json({
    ENV: {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: context.cloudflare.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
  });
};

export default function Index() {
  return (
    <AuthWrapper>
      <div className="flex flex-col h-full w-full">
        <Header />
        <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
      </div>
    </AuthWrapper>
  );
}