"use client";

import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Update the path as necessary

const DocumentsPage = () => {
  const { user } = useUser();

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height="200"
        width="300"
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height="200"
        width="300"
        alt="Empty"
        className="hidden dark:block"
      />
      <h2 className='text-lg font-medium'>
        Welcome to {user?.firstName}&apos;s Notion Clone
      </h2>
      <Button>
        <PlusCircle className='h-4 w-4 mr-2' />
        Create a note
      </Button>
    </div>
  );
}

export default DocumentsPage;