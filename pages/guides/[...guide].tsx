import React, { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { FiCheck, FiChevronRight } from 'react-icons/fi';
import { GetStaticPaths, GetStaticProps } from 'next';
import {
  fetchGuide,
  fetchGuides,
} from '../../lib/contentful';
import CodeBlock from '../../components/CodeBlock';
import ContentfulImage from '../../components/ContentfulImage';
import * as Headings from '../../components/Headings';

const Test = ({ children }) => <div>{children}</div>;

const components = {
  pre: Test,
  code: CodeBlock,
  img: ContentfulImage,
  h1: Headings.H1,
  h2: Headings.H2,
  h3: Headings.H3,
  h4: Headings.H4,
  h5: Headings.H5,
};

interface Props {
  guide: {
    title: string;
    date: string;
    introMdx: MDXRemoteSerializeResult
    steps: { key: string, title: string; content: MDXRemoteSerializeResult }[]
  }
}

const Guide: FC<Props> = ({ guide }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [visitedSections, setVisitedSections] = useState<number[]>([]);

  const router = useRouter();

  if (!router.isFallback && !guide) {
    return <ErrorPage statusCode={404} />;
  }

  if (router.isFallback && !guide?.title) {
    return <p>Loading</p>;
  }

  const onNextButtonClick = (index) => () => {
    setCurrentSection(index + 1);

    if (index === 0) {
      setVisitedSections(Array.from(new Set([0])));
      return;
    }
    setVisitedSections(Array.from(new Set([...visitedSections, index])));
  };

  const guideDate = new Date(guide.date);

  return (
    <>
      <Head>
        <title>{guide.title}</title>
        <meta name="description" content={guide.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="og:image"
          content={`https://3nrgyfm9aj.execute-api.eu-west-1.amazonaws.com/dev/hello?name=${encodeURI(
            guide.title,
          )}`}
        />
        <meta name="og:title" content={guide.title} />
        <meta name="twitter:site" content="@ashsmithco" />
        <meta name="twitter:creator" content="@ashsmithco" />
      </Head>
      <div className="text-center max-w-5xl m-auto bg-white p-8 -mt-14 mb-6">
        <h1 className="text-4xl max-w-lg m-auto">
          {guide.title}
        </h1>
        <span className="text-sm">
          Guide created on
          {' '}
          {`${guideDate.getDate()}/${guideDate.getMonth() + 1}/${guideDate.getFullYear()}`}
        </span>
      </div>

      <div className="grid grid-cols-4 max-w-5xl m-auto gap-3">
        <div className="bg-white p-6">
          <div className="sticky top-2" style={{ position: '-webkit-sticky' }}>
            <h3 className="mb-4 font-bold">Table of contents</h3>
            <ol start={0}>
              {guide.steps.map((step, index) => {
                const showCheck = visitedSections.includes(index);
                const showChevron = currentSection === index && !showCheck;
                return (
                  <li className="mb-2">
                    <div style={{ marginLeft: '-20px', marginTop: '4px', position: 'absolute' }}>
                      {showCheck && <FiCheck color="#0070F3" />}
                      {showChevron && <FiChevronRight />}
                    </div>
                    <a href={`#step-${index}`} onClick={(e) => { e.preventDefault(); setCurrentSection(index); }} className={`text-blue-600 hover:underline ${(showCheck || showChevron) && 'font-bold'}`}>
                      <span>{step.title}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
        <div className="col-span-3 bg-white p-6">
          {guide.steps.map((step, index) => (
            <div key={step.key} style={(index !== currentSection) ? { display: 'none' } : {}} className="main-content max-w-full">
              <h2 style={{ marginTop: 0 }}>{step.title}</h2>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <MDXRemote components={components} {...step.content} />
              <div className="mt-4 grid grid-cols-4">
                <div className="col-start-1">
                  {currentSection > 0 && <button className="p-2 px-4 bg-gray-200 text-black rounded-md" type="button" onClick={() => setCurrentSection(index)}>Previous</button>}
                </div>
                <div className="col-start-4 justify-self-end">
                  {currentSection === 0 && <button className="p-2 px-4 bg-blue-700 text-white rounded-md" type="button" onClick={onNextButtonClick(0)}>Let&apos;s get started!</button>}
                  {currentSection > 0 && currentSection < guide.steps.length - 1 && <button className="p-2 px-4 bg-blue-700 text-white rounded-md" type="button" onClick={onNextButtonClick(index)}>Next</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { guide },
  preview = false,
}) => {
  const permalink = Array.isArray(guide) ? guide.join('/') : guide;
  const data = await fetchGuide(permalink, preview);

  const introMdxSource = await serialize(data.fields.introduction);
  const steps = [
    {
      key: '0',
      title: 'Introduction',
      content: introMdxSource,
    },
  ];
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < data.fields.steps.length; index++) {
    const element = data.fields.steps[index];
    if (!element.fields) {
      // eslint-disable-next-line no-continue
      continue;
    }
    // eslint-disable-next-line no-await-in-loop
    const stepContent = await serialize(element.fields?.content);
    steps.push({
      key: element.sys.id,
      title: element.fields.title,
      content: stepContent,
    });
  }

  return {
    props: {
      preview,
      guide: {
        title: data?.fields.title,
        introMdx: data?.fields.introduction ? introMdxSource : null,
        date: data?.fields.date,
        steps,
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allGuides = await fetchGuides(false);
  return {
    paths: allGuides?.map(({ fields: { slug } }) => `/guides/${slug}`) ?? [],
    fallback: true,
  };
};

export default Guide;
