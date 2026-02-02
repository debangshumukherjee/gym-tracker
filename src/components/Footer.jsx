import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-4 bg-gray-100 mt-auto text-center">
      <p className="text-gray-600 text-sm">
        Designed and Built by{' '}
        <a 
          href="https://github.com/debangshumukherjee" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 font-semibold hover:underline"
        >
          Debangshu Mukherjee
        </a>
      </p>
    </footer>
  );
};

export default Footer;