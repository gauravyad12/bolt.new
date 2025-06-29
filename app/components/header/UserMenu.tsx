import { UserButton } from '@clerk/remix';
import { memo } from 'react';

export const UserMenu = memo(() => {
  return (
    <div className="flex items-center">
      <UserButton 
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
            userButtonPopoverCard: "bg-bolt-elements-background-depth-2 border-bolt-elements-borderColor",
            userButtonPopoverActionButton: "text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive",
          }
        }}
      />
    </div>
  );
});