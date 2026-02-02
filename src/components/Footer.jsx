/** @format */

import React from "react";

const Footer = () => {
  return (
    <footer className='w-full py-4 bg-gray-100 dark:bg-gray-900 mt-auto text-center transition-colors duration-300'>
      <p className='text-gray-600 dark:text-gray-400 text-sm'>
        Designed and Built by{" "}
        <a
          href='https://github.com/debangshumukherjee'
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-600 dark:text-blue-400 font-semibold hover:underline'
        >
          Debangshu Mukherjee
        </a>
      </p>
    </footer>
  );
};

export default Footer;
