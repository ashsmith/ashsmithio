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
    steps: (GuideStepFields & { key: string, content: MDXRemoteSerializeResult })[]
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
                <ol>
                  <li>
                    <div style={{ marginLeft: '-50px', position: 'absolute' }}>
                      {visitedSections.includes(0) && <CheckInCircleFill color="#0070F3" />}
                      {(currentSection === 0 && !visitedSections.includes(0)) && <ChevronRightCircleFill />}
                    </div>
                    <a href="#step-0" onClick={(e) => { e.preventDefault(); setCurrentSection(0); }}>
                      <Text span b={currentSection === 0 || visitedSections.includes(0)}>Introduction</Text>
                    </a>
                  </li>
                  {guide.steps.map((step, index) => (
                    <li>
                      <div style={{ marginLeft: '-50px', position: 'absolute' }}>
                        {visitedSections.includes(index + 1) && <CheckInCircleFill color="#0070F3" />}
                        {(currentSection === (index + 1) && !visitedSections.includes(index + 1)) && <ChevronRightCircleFill />}
                      </div>
                      <a href={`#step-${index + 1}`} onClick={(e) => { e.preventDefault(); setCurrentSection(index + 1);  }}>
                        <Text span b={currentSection === index + 1 || visitedSections.includes(index + 1)}>{step.title}</Text>
                      </a>
                    </li>
                  ))}
                </ol>
              </Col>
            </Row>
          </Grid>
          <Grid md={16}>
            <div style={{ display: (currentSection === 0) ? 'block' : 'none' }}>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <MDXRemote components={components} {...guide.introMdx} />
              <Row gap={0.8} justify="end" style={{ marginBottom: '15px' }}>
                <Col span={2}>
                  <Button auto type="success-light" onClick={() => { setCurrentSection(1); setVisitedSections([0]); }}>Let&apos;s get started!</Button>
                </Col>
              </Row>
            </div>
            {guide.steps.map((step, index) => (
              <div key={step.key} style={{ display: ((index + 1) === currentSection) ? 'block' : 'none' }}>
                <Row gap={1} style={{ marginBottom: '15px' }}>
                  <Col span={20}>
                    <Text h2>{step.title}</Text>
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    <MDXRemote components={components} {...step.content} />
                  </Col>
                </Row>
                <Row gap={1} justify="end" style={{ marginBottom: '15px' }}>
                  <Col span={4}>
                    <Button auto type="default" onClick={() => setCurrentSection(index)}>Previous</Button>
                  </Col>
                  <Spacer x={30} />
                  <Col span={4}>
                    {currentSection < guide.steps.length && <Button auto type="success-light" onClick={() => { setCurrentSection(index + 2); setVisitedSections([...visitedSections, index + 1]); }}>Next</Button>}
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

  console.log(data.fields.steps[0]);
  const steps = [];
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
