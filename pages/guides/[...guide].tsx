import React, { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import ErrorPage from 'next/error';
import Head from 'next/head';
import {
  Text, Row, Col, Button, Grid, Spacer,
} from '@geist-ui/react';
import CheckInCircleFill from '@geist-ui/react-icons/checkInCircleFill';
import ChevronRightCircleFill from '@geist-ui/react-icons/chevronRightCircleFill'
import { GetStaticPaths, GetStaticProps } from 'next';
import {
  fetchGuide,
  fetchGuides,
  GuideStepFields,
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

const Post: FC<Props> = ({ guide }) => {
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
      <>
        <Text h1 size="2.5rem" style={{ textAlign: 'center' }}>
          {guide.title}
        </Text>
        <Text type="secondary">
          Posted on
          {' '}
          {`${guideDate.getDate()}/${guideDate.getMonth() + 1}/${guideDate.getFullYear()}`}
        </Text>

        <Grid.Container>
          <Grid md={6}>
            <Row>
              <Col>
                <Text h3>Table of contents</Text>
                <ol start={0}>
                  {guide.steps.map((step, index) => {
                    const showCheck = visitedSections.includes(index);
                    const showChevron = currentSection === index && !showCheck;
                    return (
                      <li>
                        <div style={{ marginLeft: '-50px', position: 'absolute' }}>
                          {showCheck && <CheckInCircleFill color="#0070F3" />}
                          {showChevron && <ChevronRightCircleFill />}
                        </div>
                        <a href={`#step-${index}`} onClick={(e) => { e.preventDefault(); setCurrentSection(index); }}>
                          <Text span b={showCheck || showChevron}>{step.title}</Text>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </Col>
            </Row>
          </Grid>
          <Grid md={16}>
            {guide.steps.map((step, index) => (
              <div key={step.key} style={{ display: (index === currentSection) ? 'block' : 'none' }}>
                <Row gap={0.5} style={{ marginBottom: '15px' }}>
                  <Col span={20}>
                    <Text h2>{step.title}</Text>
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    <MDXRemote components={components} {...step.content} />
                  </Col>
                </Row>
                <Row gap={0.5} justify="end" style={{ marginBottom: '15px' }}>
                  <Col span={4}>
                    {currentSection > 0 && <Button auto type="default" onClick={() => setCurrentSection(index)}>Previous</Button>}
                  </Col>
                  <Spacer x={30} />
                  <Col span={4}>
                    {currentSection === 0 && <Button auto type="success-light" onClick={onNextButtonClick(0)}>Let&apos;s get started!</Button>}
                    {currentSection > 0 && currentSection < guide.steps.length - 1 && <Button auto type="success-light" onClick={onNextButtonClick(index)}>Next</Button>}
                  </Col>
                </Row>
              </div>
            ))}
          </Grid>
        </Grid.Container>

      </>
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
  /* eslint-disable-next-line no-plusplus */
  for (let index = 0; index < data.fields.steps.length; index++) {
    const element = data.fields.steps[index];
    /* eslint-disable-next-line no-await-in-loop */
    const stepContent = await serialize(element.fields.content);
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

export default Post;
