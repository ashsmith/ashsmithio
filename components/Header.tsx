import React, { FC } from 'react';
import Link from 'next/link';
import {
  SiGithub, SiTwitter, SiInstagram, SiLinkedin, SiStrava,
} from 'react-icons/si';

const Header: FC = () => (
  <header className="header text-white pt-2 pb-16">
    <div className="max-w-screen-lg m-auto">
      <div className="grid grid-cols-2 gap-2">
        <div className="place-self-start">
          <ul>
            <li className="inline-block px-2"><Link href="/">Home</Link></li>
            {/* <li className="inline-block px-2"><Link href="/">About</Link></li> */}
            {/* <li className="inline-block px-2"><Link href="/">Blog</Link></li> */}
          </ul>
        </div>
        <div className="place-self-end">
          <ol>
            <li className="inline-block px-2">
              <a href="https://twitter.com/ashsmithco" rel="nofollow noopener">
                <SiTwitter title="Follow me on Twitter" />
              </a>
            </li>
            <li className="inline-block px-2">
              <a href="https://www.strava.com/athletes/5154252" rel="nofollow noopener">
                <SiStrava title="Follow me on Strava" />
              </a>
            </li>
            <li className="inline-block px-2">
              <a href="https://github.com/ashsmith" rel="nofollow noopener">
                <SiGithub title="Follw me on GitHub" />
              </a>
            </li>
            <li className="inline-block px-2">
              <a href="https://instagram.com/ashsmithtri" rel="nofollow noopener">
                <SiInstagram title="Follow me on Instagram" />
              </a>
            </li>
            <li className="inline-block px-2">
              <a href="https://www.linkedin.com/in/ashsmithco/" rel="nofollow noopener">
                <SiLinkedin title="Connect with me on LinkedIn" />
              </a>
            </li>
          </ol>
        </div>
      </div>
      <div className="max-w-xl m-auto flex justify-center mb-8">
        <img src="https://via.placeholder.com/95" alt="" className="rounded-full" />
        <div className="flex flex-col items-center ml-8">
          <h1 className="text-5xl">Ash Smith</h1>
          <h3 className="text-xl">Cloud & Serverless Developer</h3>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
