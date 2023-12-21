"use client"

// CopyToClipboard.tsx
import { useState } from 'react';
import { CopyIcon } from '@radix-ui/react-icons'

interface CopyToClipboardProps {
  inviteCode: string ;
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ inviteCode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(`https://discord.gg/${inviteCode}`);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-muted-foreground flex items-center">
      <p
        className="text-muted-foreground flex items-center cursor-pointer"
        onClick={handleCopyClick}
      >
        https://discord.gg/{inviteCode} <CopyIcon className="h-4 w-4 text-muted-foreground ml-2" />
      </p>

      {copied && <div className="text-primary ml-2">Copied!</div>}
    </div>
  );
};

export default CopyToClipboard;