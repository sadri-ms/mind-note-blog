import React from 'react';
import { PortableText } from '@portabletext/react';
import { PortableTextBlock } from '@portabletext/types';

interface PortableTextRendererProps {
  value: PortableTextBlock[] | null | undefined;
}

export const PortableTextRenderer: React.FC<PortableTextRendererProps> = ({ value }) => {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return (
      <p className="text-custom-mediumGray dark:text-gray-400 mb-6 leading-relaxed">
        No content available.
      </p>
    );
  }

  // Parse if it's a JSON string
  let parsedValue: PortableTextBlock[];
  if (typeof value === 'string') {
    try {
      parsedValue = JSON.parse(value);
    } catch {
      return (
        <p className="text-custom-mediumGray dark:text-gray-400 mb-6 leading-relaxed">
          Error parsing content.
        </p>
      );
    }
  } else {
    parsedValue = value;
  }

  const components = {
    block: {
      h1: ({ children }: any) => (
        <h1 className="text-4xl font-bold text-custom-black dark:text-white mt-12 mb-6">
          {children}
        </h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-3xl font-semibold text-custom-black dark:text-white mt-12 mb-6">
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-2xl font-semibold text-custom-black dark:text-white mt-10 mb-4">
          {children}
        </h3>
      ),
      h4: ({ children }: any) => (
        <h4 className="text-xl font-semibold text-custom-black dark:text-white mt-8 mb-3">
          {children}
        </h4>
      ),
      normal: ({ children }: any) => (
        <p className="text-custom-mediumGray dark:text-gray-400 mb-6 leading-relaxed">
          {children}
        </p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-blue-500 pl-6 italic my-10 text-xl text-gray-700 dark:text-gray-300">
          {children}
        </blockquote>
      ),
    },
    marks: {
      strong: ({ children }: any) => (
        <strong className="font-semibold text-custom-black dark:text-white">{children}</strong>
      ),
      em: ({ children }: any) => <em className="italic">{children}</em>,
      link: ({ children, value }: any) => (
        <a
          href={value?.href}
          target={value?.blank ? '_blank' : undefined}
          rel={value?.blank ? 'noopener noreferrer' : undefined}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline"
        >
          {children}
        </a>
      ),
      code: ({ children }: any) => (
        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">
          {children}
        </code>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc list-inside mb-6 space-y-2 text-custom-mediumGray dark:text-gray-400">
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-decimal list-inside mb-6 space-y-2 text-custom-mediumGray dark:text-gray-400">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => <li className="ml-4">{children}</li>,
      number: ({ children }: any) => <li className="ml-4">{children}</li>,
    },
  };

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <PortableText value={parsedValue} components={components} />
    </div>
  );
};

